const moment = require('moment')

const proxy = require('../../config/proxy')

const headers = { Authorization: `Bearer ${process.env.TRACK_SALE_TOKEN}` }
const url = 'https://api.tracksale.co/v2'

module.exports = {
  parseAnswer(answer) {
    const {
      id,
      campain_code: campain,
      time: date,
      email: user,
      nps_answer: nps,
      nps_comment: comment,
      elapsed_time: elapsedTime
    } = answer

    return {
      id,
      campain,
      date,
      user,
      nps,
      comment,
      elapsedTime
    }
  },

  handleAnswers(answers) {
    return (answers || []).map(answer => this.parseAnswer(answer))
  },

  answersUri(codes = '21', date = null) {
    const startDate = moment(date || moment().subtract(1, 'day')).format('YYYY-MM-DD')
    return `${url}/report/answer?codes=${codes}&start=${startDate}`
  },

  retrieveAll(codes, date) {
    return new Promise((resolve, reject) => {
      proxy(headers)
        .get(this.answersUri(codes, date))
        .then(res => {
          resolve(this.handleAnswers(res.data))
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
