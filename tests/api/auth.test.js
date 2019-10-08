const chai = require('chai'),
  expect = chai.expect,
  should = chai.should()

const chaiHttp = require('chai-http')

const server = require('../../server')

const USER = process.env.USER
const PASSWORD = process.env.PASSWORD

chai.use(chaiHttp)

describe('controllers/auth', () => {
  describe('post /auth/sign_in', () => {
    describe('when the req body is wrong or empty', () => {
      it('must return 401 with no body', done => {
        chai
          .request(server)
          .post('/auth/sign_in')
          .end((err, res) => {
            res.should.have.status(401)
            res.body.should.be.empty
            done()
          })
      })
    })

    describe('when the req body is correct', () => {
      const data = {
        user: USER,
        password: PASSWORD
      }

      it('must return 200 with token on body', done => {
        chai
          .request(server)
          .post('/auth/sign_in')
          .send(data)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.an('object')
            expect(res.body).to.have.property('token')
            done()
          })
      })
    })
  })
})
