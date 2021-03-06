const moment = require('moment')

const answersData = require('../../data/answers')
const Database = require('../../config/Database')
const proxy = require('../../config/proxy')
const answerService = require('../answer')

const { TRACK_SALE_TOKEN, TRACK_SALE_CAMPAIGNS } = process.env
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
    return `${url}/report/answer?codes=${codes || TRACK_SALE_CAMPAIGNS}&start=${startDate}&limit=-1`
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
    return (answers || []).filter(answer => !(currentIds || []).includes(answer.id))
  },

  updateDatabase() {
    let db, ids

    const databaseInstance = new Database()

    return new Promise((resolve, reject) => {
      databaseInstance
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
          databaseInstance.closeConnection()
          return resolve(result)
        })
        .catch(err => {
          databaseInstance.closeConnection()
          return reject(err)
        })
    })
  }
}
