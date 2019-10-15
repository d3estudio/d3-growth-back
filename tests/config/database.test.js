const chai = require('chai'),
  expect = chai.expect,
  should = chai.should()

const database = require('../../app/config/database')

const { MONGO_DB, MONGO_HOST, MONGO_PORT } = process.env
const uriRegex = new RegExp(`mongodb\:\/\/(${MONGO_HOST})\:(${MONGO_PORT})\/(${MONGO_DB})`)

let db

describe('app/config/database', () => {
  before(done => {
    database
      .connect()
      .then(instance => {
        db = instance
        done()
      })
      .catch(err => done(err))
  })

  after(done => {
    db.dropDatabase({}, (err, result) => {
      database.closeConnection()

      if (err) {
        done(err)
      } else {
        done()
      }
    })
  })

  describe('connect()', () => {
    it('should provide the connected client', () => {
      database.client.should.be.an('object')
      database.client['topology']['s']['connected'].should.be.true
    })

    it('should return the correct database', () => {
      expect(db.databaseName).to.equals(MONGO_DB)
    })
  })

  describe('closeConnection()', () => {
    it('should close connection correctly', () => {})
  })

  describe('uri()', () => {
    it('should have correct config', () => {
      uriRegex.test(database.uri()).should.be.true
    })
  })
})
