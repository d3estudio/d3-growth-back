const chai = require('chai'),
  expect = chai.expect,
  should = chai.should()

const chaiHttp = require('chai-http')

const server = require('../../server')

chai.use(chaiHttp)

describe('API', () => {
  describe('express instance', () => {
    it('should be a function', () => {
      server.should.be.a('function')
    })
  })

  describe('get /version', () => {
    it('must return 200 with an object with version', done => {
      chai
        .request(server)
        .get('/version')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          expect(res.body).to.have.property('version')
          done()
        })
    })
  })
})
