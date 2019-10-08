const chai = require('chai'),
  should = chai.should()

const proxy = require('../../app/config/proxy')

describe('app/config/proxy', () => {
  describe('axios instance', () => {
    it('should be a function', () => {
      proxy.should.be.a('function')
    })
  })
})
