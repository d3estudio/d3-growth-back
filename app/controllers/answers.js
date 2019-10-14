const answersData = require('../data/answers')
const database = require('../config/database')
const queriesHelper = require('../helpers/queries')
const trackSaleService = require('../services/thirdParty/trackSale')

module.exports = {
  forceUpdate(_, res) {
    trackSaleService
      .updateDatabase()
      .then(() => {
        return res.status(204).send()
      })
      .catch(err => {
        return res.status(424).send(err)
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
  },

  index(req, res) {
    const { query } = req
    const { sort_by: sortBy, direction, page } = query

    database
      .connect()
      .then(db => {
        return answersData.getIndex({
          db,
          query: queriesHelper.requestParamsToQuery(query),
          sort: queriesHelper.sortByToQuery(sortBy, direction),
          skip: queriesHelper.skipToQuery(page)
        })
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
