const COLLECTION_NAME = 'answers'

module.exports = {
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
