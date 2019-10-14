const answersData = require('../data/answers')
const database = require('../config/database')
const queriesHelper = require('../helpers/queries')
const trackSaleService = require('../services/thirdParty/trackSale')

module.exports = {
  index(req, res) {
    let db, total
    const { query: params } = req
    const query = queriesHelper.requestParamsToQuery(params)

    database
      .connect()
      .then(instance => {
        db = instance
        return answersData.getIndexCount({ db, query })
      })
      .then(count => {
        total = count

        const { sort_by: sortBy, direction, page } = params
        const sort = queriesHelper.sortByToQuery(sortBy, direction)
        const skip = queriesHelper.skipToQuery(page)

        return answersData.getIndex({ db, query, sort, skip })
      })
      .then(answers => {
        database.closeConnection()
        return res.send({ total, answers })
      })
      .catch(err => {
        database.closeConnection()
        return res.status(422).send(err)
      })
  },

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
  }
}
