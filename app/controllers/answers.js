const answersData = require('../data/answers')
const database = require('../config/database')
const trackSaleService = require('../services/thirdParty/trackSale')

module.exports = {
  forceUpdate(_, res) {
    trackSaleService
      .updateDatabase()
      .then(() => {
        return res.status(204).send()
      })
      .catch(err => {
        return res.status(422).send(err)
      })
  },

  relatedWith(req, res) {
    const { subject } = req.query

    database
      .connect()
      .then(db => {
        return answersData.getRelated(db, subject)
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
