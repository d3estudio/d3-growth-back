const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should()

const answersHelper = require('../../app/helpers/answers')

describe('app/helpers/answers', () => {
  describe('normalizeAnswerString(answer)', () => {
    describe('when the param is not present', () => {
      it('should return an empty string', () => {
        answersHelper
          .normalizeAnswerString('')
          .should.be.a('string')
          .with.lengthOf(0)
      })
    })

    describe('when the param is present', () => {
      describe('and contains accent or cedilha', () => {
        it('should return normalized string', () => {
          assert.equal(answersHelper.normalizeAnswerString('çãúâAñö çñ'), 'cauaano cn')
        })
      })

      describe('and is a number', () => {
        it('should convert number into a string', () => {
          assert.equal(answersHelper.normalizeAnswerString(12345), '12345')
        })
      })
    })
  })

  describe('handleSummaryFromDb(docs)', () => {})
  describe('calculateNps(summary)', () => {})
  describe('termToQuery(term)', () => {})
})
