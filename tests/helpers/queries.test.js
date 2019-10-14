const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should()

const queriesHelper = require('../../app/helpers/queries')
const mock = require('../mocks/queriesHelper.mock')

describe('app/helpers/answers', () => {
  describe('termToQuery(term)', () => {
    it('should return correct query for term "abc"', () => {
      const term = 'abc'

      queriesHelper.termToQuery(term).should.have.length(1)
      queriesHelper.termToQuery(term)[0].should.have.property('normalizedComment')
      queriesHelper.termToQuery(term)[0]['normalizedComment'].test('abc').should.be.true
    })

    it('should return correct query for term "abc"', () => {
      const term = 'a b c'

      queriesHelper.termToQuery(term).should.have.length(3)

      queriesHelper.termToQuery(term)[0].should.have.property('normalizedComment')

      queriesHelper.termToQuery(term)[0]['normalizedComment'].test('a').should.be.true
      queriesHelper.termToQuery(term)[1]['normalizedComment'].test('a').should.be.false
      queriesHelper.termToQuery(term)[2]['normalizedComment'].test('a').should.be.false
    })
  })
})
