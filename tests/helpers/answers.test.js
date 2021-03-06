const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should()

const answersHelper = require('../../app/helpers/answers')
const mock = require('../mocks/answersHelper.mock')

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

  describe('calculateNps(summary)', () => {
    it('should calculate correct nps', () => {
      const promoter = 80
      const detractor = 17
      const total = promoter + detractor

      const expected = Math.round(((promoter - detractor) / total) * 100)

      const nps = answersHelper.calculateNps({ promoter, detractor, total })

      expect(nps).to.equals(expected)
    })
  })

  describe('handleSummaryFromDb(docs)', () => {
    const data = mock.aggregateByTypes

    it('should return correct properties', () => {
      const keys = ['total', 'promoter', 'neutral', 'detractor']
      answersHelper.handleSummaryFromDb(data).should.have.all.keys(keys)
    })

    it('should return correct total', () => {
      const expected = mock.aggregateByTypes.reduce((prev, current) => {
        return prev + current.count
      }, 0)

      const { total } = answersHelper.handleSummaryFromDb(data)

      expect(total).to.equals(expected)
    })
  })
})
