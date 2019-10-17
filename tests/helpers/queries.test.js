const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should()

const moment = require('moment')

const queriesHelper = require('../../app/helpers/queries')

describe('app/helpers/queries', () => {
  describe('termToQuery(term)', () => {
    it('should return correct query for term "abc"', () => {
      const term = 'abc'

      queriesHelper.termToQuery(term).should.have.length(2)

      queriesHelper.termToQuery(term)[0].should.have.property('normalizedComment')
      queriesHelper.termToQuery(term)[0]['normalizedComment'].should.have.property('$ne')

      queriesHelper.termToQuery(term)[1].should.have.property('normalizedComment')
      queriesHelper.termToQuery(term)[1]['normalizedComment'].test('abc').should.be.true
    })

    it('should return correct query for term "abc"', () => {
      const term = 'a b c'

      queriesHelper.termToQuery(term).should.have.length(4)

      queriesHelper.termToQuery(term)[0].should.have.property('normalizedComment')
      queriesHelper.termToQuery(term)[0]['normalizedComment'].should.have.property('$ne')

      queriesHelper.termToQuery(term)[1].should.have.property('normalizedComment')
      queriesHelper.termToQuery(term)[1]['normalizedComment'].test('a').should.be.true
      queriesHelper.termToQuery(term)[2]['normalizedComment'].test('a').should.be.false
      queriesHelper.termToQuery(term)[3]['normalizedComment'].test('a').should.be.false
    })
  })

  describe('categoriesToQuery(categories)', () => {
    describe('when param is not present', () => {
      it('should return an array with correct length and with one empty object', () => {
        const result = queriesHelper.categoriesToQuery()

        result.should.be.an('array')
        result.should.have.lengthOf(1)

        result[0].should.be.empty
      })
    })

    describe('when param is present', () => {
      it('should return an array with correct length', () => {
        const result = queriesHelper.categoriesToQuery('a,b,c')
        result.should.be.an('array')
        result.should.have.lengthOf(3)
      })

      it('should return an array which the elements have correct key', () => {
        const result = queriesHelper.categoriesToQuery('a')
        expect(result[0]).to.have.property('category')
      })
    })
  })

  describe('rangeToQuery(startDate, endDate)', () => {
    describe('when params is not present', () => {
      const result = queriesHelper.rangeToQuery()

      it('should return an array with the query', () => {
        result.should.be.an('array')
        result.should.have.lengthOf(2)
      })

      it('should return default query', () => {
        const expectedStart = moment('1970-01-01').startOf('day')
        const expectedEnd = moment().endOf('day')

        expect(moment(result[0]['date']['$gte']).isSame(expectedStart)).to.be.true
        expect(moment(result[1]['date']['$lte']).isSame(expectedEnd)).to.be.true
      })
    })

    describe('when param is present', () => {
      const start = moment().add(7, 'days')
      const end = moment().add(13, 'days')

      const result = queriesHelper.rangeToQuery(start, end)

      it('should return an array with correct length', () => {
        result.should.be.an('array')
        result.should.have.lengthOf(2)
      })

      it('should return correct query', () => {
        const expectedStart = start.startOf('day')
        const expectedEnd = end.endOf('day')

        expect(moment(result[0]['date']['$gte']).isSame(expectedStart)).to.be.true
        expect(moment(result[1]['date']['$lte']).isSame(expectedEnd)).to.be.true
      })
    })
  })

  describe('sortByToQuery(sortBy, direction)', () => {
    describe('when params is not present', () => {
      it('should return an object with correct property and value', () => {
        const result = queriesHelper.sortByToQuery()

        result.should.have.property('date')
        expect(result['date']).to.equals(-1)
      })
    })

    describe('when param is present', () => {
      describe('and column and direction are correct', () => {
        it('should return an object with correct property and value', () => {
          const column = 'category'
          const value = '1'

          const result = queriesHelper.sortByToQuery(column, value)

          result.should.be.an('object')
          result.should.have.property(column)
          expect(result[column]).to.equals(parseInt(value))
        })
      })

      describe('and column and direction are not correct', () => {
        it('should return an object with default property and value', () => {
          const column = 'name'
          const value = '3'

          const result = queriesHelper.sortByToQuery(column, value)

          result.should.be.an('object')
          result.should.have.property('date')
          expect(result['date']).to.equals(-1)
        })
      })
    })
  })

  describe('skipToQuery(page)', () => {
    describe('when params is not present', () => {
      it('should return zero', () => {
        const result = queriesHelper.skipToQuery()
        expect(result).to.equals(0)
      })
    })

    describe('when param is present', () => {
      it('should return the correct value', () => {
        ;[0, 3, 27, 1000].forEach(item => {
          expect(queriesHelper.skipToQuery(item)).to.equals(item * 10)
        })
      })
    })
  })

  describe('limitToQuery()', () => {
    it('should return the correct value', () => {
      expect(queriesHelper.limitToQuery()).to.equals(10)
    })
  })

  describe('requestParamsToQuery(params)', () => {
    it('should have the correct keys', () => {
      const keys = ['$and', '$or']
      queriesHelper.requestParamsToQuery().should.have.all.keys(keys)
    })

    describe('when the term is present', () => {
      it('should have the correct property', () => {
        const params = {
          term: 'lorem ipsum'
        }

        const result = queriesHelper.requestParamsToQuery(params)

        result['$and'][0].should.have.property('normalizedComment')
        result['$and'][1].should.have.property('normalizedComment')
      })
    })

    describe('when the categories is present', () => {
      it('should have the correct property', () => {
        const params = {
          categories: 'client,technology,content'
        }

        const result = queriesHelper.requestParamsToQuery(params)

        expect(result['$or'][0]['category']).to.equals('client')
        expect(result['$or'][1]['category']).to.equals('technology')
        expect(result['$or'][2]['category']).to.equals('content')
      })
    })
  })
})
