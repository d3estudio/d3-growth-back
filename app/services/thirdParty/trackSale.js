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

  retrieveAll() {
    const uri = `${url}/report/answer?codes=21&limit=2`

    return new Promise((resolve, reject) => {
      proxy(headers)
        .get(uri)
        .then(res => {
          resolve(this.handleAnswers(res.data))
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
