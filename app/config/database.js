const client = require('mongodb').MongoClient
const mongoUri = require('mongodb-uri')

const MONGO_HOST = process.env.MONGO_HOST
const MONGO_PORT = process.env.MONGO_PORT
const MONGO_DB = process.env.MONGO_DB

module.exports = {
  connect() {
    return new Promise((resolve, reject) => {
      client.connect(this.uri(), { useNewUrlParser: true }, (err, client) => {
        if (err) {
          reject(err)
        } else {
          this.client = client
          resolve(this.client.db(this.uri().database))
        }
      })
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
