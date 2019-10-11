const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should()

const chaiHttp = require('chai-http')

const answersData = require('../../app/data/answers')
const database = require('../../app/config/database')
const mock = require('../mocks/answersData.mock')

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

  describe('getNps(db)', () => {
    it('should return correct properties', done => {
      const keys = ['nps', 'summary']

      answersData
        .getNps(db)
        .then(doc => {
          doc.should.be.an('object').with.all.keys(keys)
          done()
        })
        .catch(err => {
          done(err)
        })
    })
  })

  describe('getSummary(db)', () => {
    it('should return an object with correct properties', done => {
      answersData
        .getNps(db)
        .then(doc => {
          doc.should.be.an('object').with.property('summary')
          done()
        })
        .catch(err => {
          done(err)
        })
    })
  })

  describe('getRelated(db, term)', () => {
    it('should return an object with correct properties', done => {
      const keys = ['total', 'answers']

      answersData
        .getRelated(db, 'Lorem Ipsum')
        .then(doc => {
          doc.should.be.an('object').with.all.keys(keys)
          done()
        })
        .catch(err => {
          done(err)
        })
    })

    it('should return correct documents for "Lorem Ipsum"', done => {
      answersData
        .getRelated(db, 'Lorem Ipsum')
        .then(doc => {
          expect(doc.answers.length).to.equals(mock.all.length)
          done()
        })
        .catch(err => {
          done(err)
        })
    })

    it('should return correct documents for "C"', done => {
      answersData
        .getRelated(db, 'c')
        .then(doc => {
          expect(doc.answers.length).to.equals(1)
          done()
        })
        .catch(err => {
          done(err)
        })
    })
  })
})
