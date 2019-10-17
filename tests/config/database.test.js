const chai = require('chai'),
  expect = chai.expect,
  should = chai.should()

const Database = require('../../app/config/Database')

const { MONGO_DB, MONGO_HOST, MONGO_PORT } = process.env
const uriRegex = new RegExp(`mongodb\:\/\/(${MONGO_HOST})\:(${MONGO_PORT})\/(${MONGO_DB})`)

let db
const databaseInstance = new Database()

describe('app/config/database', () => {
  before(done => {
    databaseInstance
      .connect()
      .then(instance => {
        db = instance
        done()
      })
      .catch(err => done(err))
  })

  after(done => {
    db.dropDatabase({}, (err, result) => {
      databaseInstance.closeConnection()

      if (err) {
        done(err)
      } else {
        done()
      }
    })
  })

  describe('connect()', () => {
    it('should provide the connected client', () => {
      databaseInstance.client.should.be.an('object')
      databaseInstance.client['topology']['s']['connected'].should.be.true
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
      uriRegex.test(databaseInstance.uri()).should.be.true
    })
  })
})
