const client = require('mongodb').MongoClient
const mongoUri = require('mongodb-uri')

const { MONGO_DB, MONGO_HOST, MONGO_PORT } = process.env

module.exports = {
  connect() {
    return new Promise((resolve, reject) => {
      client.connect(
        this.uri(),
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err, client) => {
          if (err) {
            reject(err)
          } else {
            this.client = client
            resolve(this.client.db(this.uri().database))
          }
        }
      )
    })
  },

  closeConnection() {
    this.client && this.client.close()
  },

  uri() {
    return mongoUri.format({
      hosts: [
        {
          host: MONGO_HOST,
          port: MONGO_PORT
        }
      ],
      database: MONGO_DB
    })
  }
}
