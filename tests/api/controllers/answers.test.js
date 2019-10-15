const chai = require('chai'),
  expect = chai.expect,
  should = chai.should()

const chaiHttp = require('chai-http')
const nock = require('nock')

const server = require('../../../server')

const url = 'https://api.tracksale.co/v2'
const uriRegex = /\/report\/answer\?codes=(.*)\&start=(\d{4}-\d{2}-\d{2})\&limit=-1/

chai.use(chaiHttp)

describe('app/controllers/answers', () => {
  before(() => {
    nock(url)
      .get(uriRegex)
      .reply(200, [])
  })

  describe('get /answers', () => {
    it('should return 200 with no correct properties', done => {
      const keys = ['total', 'answers']

      chai
        .request(server)
        .get('/answers')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.all.keys(keys)
          done()
        })
    })
  })

  describe('get /answers/force_update', () => {
    it('should return 204 with no body', done => {
      chai
        .request(server)
        .get('/answers/force_update')
        .end((err, res) => {
          res.should.have.status(204)
          res.body.should.be.empty
          done()
        })
    })
  })

  describe('get /answers/related_with', () => {
    it('should return 200 with no correct properties', done => {
      const keys = ['total', 'answers']

      chai
        .request(server)
        .get('/answers/related_with')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.all.keys(keys)
          done()
        })
    })
  })
})
