const moment = require('moment')

const answersData = require('../../data/answers')
const database = require('../../config/database')
const proxy = require('../../config/proxy')
const answerService = require('../answer')

const { TRACK_SALE_TOKEN } = process.env
const headers = { Authorization: `Bearer ${TRACK_SALE_TOKEN}` }
const url = 'https://api.tracksale.co/v2'

module.exports = {
  parseAnswer(answer) {
    const {
      id,
      campaign_code: campaign,
      time: date,
      email: user,
      nps_answer: nps,
      nps_comment: comment,
      elapsed_time: elapsedTime
    } = answer

    return {
      id,
      campaign,
      date: moment.unix(date).toDate(),
      user,
      nps,
      comment,
      elapsedTime
    }
  },

  handleAnswers(answers) {
    return (answers || []).map(answer => answerService.classify(this.parseAnswer(answer)))
  },

  answersUri(codes, date) {
    const startDate = moment(date || moment().subtract(1, 'day')).format('YYYY-MM-DD')
    return `${url}/report/answer?codes=${codes || '21'}&start=${startDate}&limit=-1`
  },

  retrieve(codes, date) {
    return new Promise((resolve, reject) => {
      proxy(headers)
        .get(this.answersUri(codes, date))
        .then(res => {
          return resolve(this.handleAnswers(res.data))
        })
        .catch(err => reject(err))
    })
  },

  getAnswerIds(docs) {
    return (docs || []).map(doc => doc.id)
  },

  filterNewAnswers(currentIds, answers) {
    return (answers || []).filter(
      answer => !(currentIds || []).includes(answer.id) && !!answer.comment
    )
  },

  updateDatabase() {
    let db, ids

    return new Promise((resolve, reject) => {
      database
        .connect()
        .then(instance => {
          db = instance
          return answersData.getAll(db)
        })
        .then(docs => {
          ids = this.getAnswerIds(docs)
          return this.retrieve('', moment().subtract(3, 'months'))
        })
        .then(answers => {
          const toInsert = this.filterNewAnswers(ids, answers)
          return toInsert.length ? answersData.insertMany(db, toInsert) : Promise.resolve([])
        })
        .then(result => {
          database.closeConnection()
          return resolve(result)
        })
        .catch(err => {
          database.closeConnection()
          return reject(err)
        })
    })
  }
}
