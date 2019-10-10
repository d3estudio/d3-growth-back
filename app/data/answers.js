const answersHelper = require('../helpers/answers')

const COLLECTION_NAME = 'answers'

module.exports = {
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

  insertMany(db, docs) {
    return new Promise((resolve, reject) => {
      db.collection(COLLECTION_NAME).insertMany(docs, (err, result) => {
        if (err) {
          return reject(err)
        }

        return resolve(result)
      })
    })
  }
}
