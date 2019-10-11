const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should()

const moment = require('moment')
const nock = require('nock')

const database = require('../../../app/config/database')
const trackSaleService = require('../../../app/services/thirdParty/trackSale')
const mock = require('../../mocks/trackSaleService.mock')

const url = 'https://api.tracksale.co/v2'
const uriRegex = /\/report\/answer\?codes=(.*)\&start=(\d{4}-\d{2}-\d{2})\&limit=-1/

const { TRACK_SALE_CAMPAIGNS } = process.env
let db

describe('app/services/thirdParty/trackSale', () => {
  before(done => {
    database
      .connect()
      .then(instance => {
        db = instance
        done()
      })
      .catch(err => done(err))
  })

  after(done => {
    db.dropDatabase({}, (err, result) => {
      database.closeConnection()

      if (err) {
        done(err)
      } else {
        done()
      }
    })
  })

  const answers = mock.retrieve

  describe('parseAnswer(answer)', () => {
    const keys = ['id', 'campaign', 'date', 'user', 'nps', 'comment', 'elapsedTime']

    describe('when the param is correct', () => {
      it('should have all correct keys', () => {
        const answer = mock.retrieve[0]
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
        const answers = mock.retrieve
        assert.lengthOf(trackSaleService.handleAnswers(answers), answers.length)
      })
    })
  })

  describe('answersUri(codes, date)', () => {
    describe('when the params are not present', () => {
      const [_, codes, start] = uriRegex.exec(trackSaleService.answersUri())

      it(`should return uri with param codes = ${TRACK_SALE_CAMPAIGNS}`, () => {
        expect(codes).to.equals(TRACK_SALE_CAMPAIGNS)
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

  describe('retrieve(codes, date)', () => {
    beforeEach(() => {
      nock(url)
        .get(uriRegex)
        .reply(200, answers)
    })

    it(`must return 200 with all answers`, () => {
      trackSaleService
        .retrieve()
        .then(result => {
          result.should.be.an('array').with.lengthOf(answers.length)
        })
        .catch(err => {
          console.error(err)
        })
    })
  })

  describe('getAnswersIds(docs)', () => {
    describe('when the params are not correct', () => {
      it('should return empty array', () => {
        trackSaleService
          .getAnswerIds()
          .should.be.an('array')
          .with.lengthOf(0)
      })
    })

    describe('when the params are correct', () => {
      it('should return an array with ids', () => {
        const answers = [{ id: 1, abc: 0 }, { id: 2, abc: 0 }]
        const result = trackSaleService.getAnswerIds(answers)

        result.should.be.an('array').with.lengthOf(answers.length)

        expect(result[0]).to.equals(1)
        expect(result[1]).to.equals(2)
      })
    })
  })

  describe('filterNewAnswers(currentIds, answers)', () => {
    describe('when the params are not correct', () => {
      it('should return empty array', () => {
        trackSaleService
          .filterNewAnswers()
          .should.be.an('array')
          .with.lengthOf(0)
      })
    })

    describe('when the params are correct', () => {
      it('should return an array with ids', () => {
        const currentIds = [1, 3, 4]
        const answers = [{ id: 1 }, { id: 2 }, { id: 5 }]
        const result = trackSaleService.filterNewAnswers(currentIds, answers)

        result.should.be.an('array').with.lengthOf(2)

        expect(result[0]['id']).to.equals(2)
      })
    })
  })

  describe('updateDatabase()', () => {
    beforeEach(() => {
      nock(url)
        .get(uriRegex)
        .reply(200, answers)
    })

    it('should insert all answers on database', done => {
      trackSaleService
        .updateDatabase()
        .then(result => {
          result.should.have.property('insertedCount')
          expect(result.insertedCount).to.equals(answers.length)
          done()
        })
        .catch(err => done(err))
    })

    after(done => {
      db.dropDatabase({}, (err, result) => {
        database.closeConnection()

        if (err) {
          done(err)
        } else {
          done()
        }
      })
    })
  })
})
