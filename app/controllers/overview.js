const database = require('../config/database')
const answersData = require('../data/answers')

module.exports = {
  summary(req, res) {
    database
      .connect()
      .then(db => {
        return answersData.getSummary(db)
      })
      .then(result => {
        database.closeConnection()
        return res.send(result)
      })
      .catch(err => {
        database.closeConnection()
        return res.status(422).send(err)
      })
  }
}
