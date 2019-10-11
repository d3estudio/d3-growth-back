const chai = require('chai'),
  expect = chai.expect,
  should = chai.should()

const chaiHttp = require('chai-http')

const server = require('../../../server')

const { AUTH_PASSWORD, AUTH_USER } = process.env

chai.use(chaiHttp)

describe('app/controllers/auth', () => {
  describe('post /auth/sign_in', () => {
    describe('when the req body is wrong or empty', () => {
      it('should return 401 with no body', done => {
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
        user: AUTH_USER,
        password: AUTH_PASSWORD
      }

      it('should return 201 with token on body', done => {
        chai
          .request(server)
          .post('/auth/sign_in')
          .send(data)
          .end((err, res) => {
            res.should.have.status(201)
            res.body.should.be.an('object')
            expect(res.body).to.have.property('token')
            done()
          })
      })
    })
  })
})
