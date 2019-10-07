const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should()

const mocha = require('mocha'),
  describe = mocha.describe

const moment = require('moment')
const nock = require('nock')

const trackSaleService = require('../../../app/services/thirdParty/trackSale')
const mock = require('./trackSale.mock')
const url = 'https://api.tracksale.co/v2'
const uriRegex = /\/report\/answer\?codes=(.*)\&start=(\d{4}-\d{2}-\d{2})/

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
    describe('when the param is not present', () => {
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

  describe('answersUri(codes, date)', () => {
    describe('when the params are not present', () => {
      const [_, codes, start] = uriRegex.exec(trackSaleService.answersUri())

      it('should return uri with param codes = 21', () => {
        expect(codes).to.equals('21')
      })

      it('should return uri with yesterday as start param', () => {
        expect(start).to.equals(
          moment()
            .subtract(1, 'day')
            .format('YYYY-MM-DD')
        )
      })
    })

    describe('when the params are present', () => {
      const inputCodes = '1,2,4,5,3'
      const inputDate = moment()
        .subtract(3, 'months')
        .format('YYYY-MM-DD')

      const [_, codes, start] = uriRegex.exec(trackSaleService.answersUri(inputCodes, inputDate))

      it('should return correct codes', () => {
        expect(codes).to.equals(inputCodes)
      })

      it('should return correct start', () => {
        expect(start).to.equals(inputDate)
      })
    })
  })

  describe('retrieveAll(codes, date)', () => {
    const answers = mock.retrieveAll

    beforeEach(() => {
      nock(url)
        .get(uriRegex)
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
