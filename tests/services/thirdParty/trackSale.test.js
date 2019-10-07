const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should()

const mocha = require('mocha'),
  describe = mocha.describe

const nock = require('nock')

const trackSaleService = require('../../../app/services/thirdParty/trackSale')
const mock = require('./trackSale.mock')
const url = 'https://api.tracksale.co/v2'

describe('app/services/thirdParty/trackSale', () => {
  describe('parseAnswer(answer)', () => {
    const keys = ['id', 'campain', 'date', 'user', 'nps', 'comment', 'elapsedTime']

    describe('when the param is correct', () => {
      it('should have all correct keys', () => {
        const answer = mock.retrieveAll[0]
        expect(trackSaleService.parseAnswer(answer)).to.have.all.keys(keys)
      })
    })

    describe('when the param is no correct', () => {
      it('should have all correct keys', () => {
        expect(trackSaleService.parseAnswer({ a: 1, b: 2 })).to.have.all.keys(keys)
      })
    })
  })

  describe('handleAnswers(answers)', () => {
    describe('when te param is not present', () => {
      it('should return an empty array', () => {
        trackSaleService
          .handleAnswers(null)
          .should.be.an('array')
          .with.lengthOf(0)
      })
    })

    describe('when te param is present', () => {
      it('should have parsed answers', () => {
        const answers = mock.retrieveAll
        assert.lengthOf(trackSaleService.handleAnswers(answers), answers.length)
      })
    })
  })

  describe('retrieveAll()', () => {
    const answers = mock.retrieveAll

    beforeEach(() => {
      nock(url)
        .get('/report/answer?codes=21&limit=2')
        .reply(200, answers)
    })

    it(`must return 200 with all answers`, () => {
      trackSaleService
        .retrieveAll()
        .then(result => {
          result.should.be.an('array').with.lengthOf(answers.length)
        })
        .catch(err => {
          console.error(err)
        })
    })
  })
})
