const answersHelper = require('../helpers/answers')
const queriesHelper = require('../helpers/queries')

const COLLECTION_NAME = 'answers'

module.exports = {
  insertMany(db, docs) {
    return new Promise((resolve, reject) => {
      db.collection(COLLECTION_NAME).insertMany(docs, (err, result) => {
        if (err) {
          return reject(err)
        }

        return resolve(result)
      })
    })
  },

  getIndex({ db, query, sort, skip }) {
    return new Promise((resolve, reject) => {
      db.collection(COLLECTION_NAME)
        .find(query)
        .project({ _id: 0, normalizedComment: 0 })
        .sort(sort)
        .collation({ locale: 'pt' })
        .skip(skip)
        .limit(10)
        .toArray((err, docs) => {
          if (err) {
            return reject(err)
          }

          return resolve(docs)
        })
    })
  },

  getAll(db) {
    return new Promise((resolve, reject) => {
      db.collection(COLLECTION_NAME)
        .find({})
        .toArray((err, docs) => {
          if (err) {
            return reject(err)
          }

          return resolve(docs)
        })
    })
  },

  getNps(db) {
    return new Promise((resolve, reject) => {
      db.collection(COLLECTION_NAME)
        .aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }])
        .toArray((err, doc) => {
          if (err) {
            return reject(err)
          }

          const summary = answersHelper.handleSummaryFromDb(doc)
          const nps = answersHelper.calculateNps(summary)

          return resolve({ summary, nps })
        })
    })
  },

  getSummary(db) {
    return new Promise((resolve, reject) => {
      db.collection(COLLECTION_NAME)
        .aggregate([
          { $match: { comment: { $ne: null } } },
          { $group: { _id: '$type', count: { $sum: 1 } } }
        ])
        .toArray((err, doc) => {
          if (err) {
            return reject(err)
          }

          const summary = {
            ...answersHelper.handleSummaryFromDb(doc),
            abandonedTasks: 0,
            completeTasks: 0
          }

          return resolve({ summary })
        })
    })
  },

  getRelated(db, term) {
    const query = [...queriesHelper.termToQuery(term), { normalizedComment: { $ne: null } }]

    return new Promise((resolve, reject) => {
      db.collection(COLLECTION_NAME)
        .find({
          $and: query
        })
        .toArray((err, answers) => {
          if (err) {
            return reject(err)
          }

          const total = answers.length

          return resolve({ total, answers })
        })
    })
  }
}
