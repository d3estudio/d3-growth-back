const chai = require('chai'),
  expect = chai.expect,
  should = chai.should()

const chaiHttp = require('chai-http')

const server = require('../../index')

chai.use(chaiHttp)

describe('Server', () => {
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
