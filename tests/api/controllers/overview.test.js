const chai = require('chai'),
  should = chai.should()

const chaiHttp = require('chai-http')

const server = require('../../../server')

const { TOKEN_SECRET } = process.env

chai.use(chaiHttp)

describe('app/controllers/overview', () => {
  describe('get /overview/nps_report', () => {
    it('should return 200 with correct properties', done => {
      const keys = ['summary', 'nps']

      chai
        .request(server)
        .get('/overview/nps_report')
        .set('Authorization', `Bearer ${TOKEN_SECRET}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.all.keys(keys)
          done()
        })
    })
  })

  describe('get /overview/summary', () => {
    it('should return 200 with correct property', done => {
      chai
        .request(server)
        .get('/overview/summary')
        .set('Authorization', `Bearer ${TOKEN_SECRET}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('summary')
          done()
        })
    })
  })
})
