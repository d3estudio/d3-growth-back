const chai = require('chai'),
  should = chai.should()

const passport = require('../../app/config/passport')

describe('app/config/passport', () => {
  describe('BearerStrategy()', () => {
    passport['_strategies'].should.have.property('bearer')
  })
})
