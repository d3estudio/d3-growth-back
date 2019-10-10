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
        res.send(result)
      })
      .catch(err => {
        database.closeConnection()
        res.send(err)
      })
  }
}
