const chai = require('chai'),
  should = chai.should()

const cors = require('../../app/config/cors')

describe('app/config/cors', () => {
  describe('whitelist()', () => {
    it('should permit correct origin', () => {
      const test = cors.whitelist()[0].test('growth.d3.do')
      test.should.be.true
    })
  })

  describe('options()', () => {
    it('should have correct property', () => {
      cors.options().should.have.property('origin')
    })
  })

  describe('configure()', () => {})
})
