const Database = require('../config/Database')
const answersData = require('../data/answers')

module.exports = {
  npsReport(_, res) {
    const databaseInstance = new Database()

    databaseInstance
      .connect()
      .then(db => {
        return answersData.getNps(db)
      })
      .then(result => {
        databaseInstance.closeConnection()
        return res.send(result)
      })
      .catch(err => {
        databaseInstance.closeConnection()
        return res.status(422).send(err)
      })
  },

  summary(_, res) {
    const databaseInstance = new Database()

    databaseInstance
      .connect()
      .then(db => {
        return answersData.getSummary(db)
      })
      .then(result => {
        databaseInstance.closeConnection()
        return res.send(result)
      })
      .catch(err => {
        databaseInstance.closeConnection()
        return res.status(422).send(err)
      })
  }
}
