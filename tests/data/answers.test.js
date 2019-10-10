const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should()

const mocha = require('mocha'),
  describe = mocha.describe

const chaiHttp = require('chai-http')

const answersData = require('../../app/data/answers')
const database = require('../../app/config/database')
const mock = require('./answers.mock')

chai.use(chaiHttp)

let db

describe('app/data/answers', () => {
  before(done => {
    database
      .connect()
      .then(instance => {
        db = instance
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  describe('insertMany(db)', () => {
    it('should insert all answers into database', done => {
      answersData
        .insertMany(db, mock.all)
        .then(result => {
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('getAll(db)', () => {
    it('should return all answers from database', done => {
      answersData
        .getAll(db)
        .then(docs => {
          docs.should.be.an('array').with.lengthOf(mock.all.length)
          done()
        })
        .catch(err => {
          done(err)
        })
    })
  })

  describe('getNps(db)', () => {})

  describe('getSummary(db)', () => {})

  describe('getRelated(db, term)', () => {})

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
})
