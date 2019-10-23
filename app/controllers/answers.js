const answersData = require('../data/answers')
const Database = require('../config/Database')
const queriesHelper = require('../helpers/queries')
const trackSaleService = require('../services/thirdParty/trackSale')

module.exports = {
  index(req, res) {
    let db, total
    const { query: params } = req
    const query = queriesHelper.requestParamsToQuery(params)

    const databaseInstance = new Database()

    databaseInstance
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
        databaseInstance.closeConnection()
        return res.send({ total, answers })
      })
      .catch(err => {
        databaseInstance.closeConnection()
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

    const databaseInstance = new Database()

    databaseInstance
      .connect()
      .then(db => {
        return answersData.getRelated(db, subject)
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
