const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should()

const mocha = require('mocha'),
  describe = mocha.describe

const answerService = require('../../app/services/answer')
const keywordsData = require('../../app/utils/keywords.json')

describe('app/services/answer', () => {
  describe('normalizeAnswerString(answer)', () => {
    describe('when the param is not present', () => {
      it('should return an empty string', () => {
        answerService
          .normalizeAnswerString('')
          .should.be.a('string')
          .with.lengthOf(0)
      })
    })

    describe('when the param is present', () => {
      describe('and contains accent or cedilha', () => {
        it('should return normalized string', () => {
          assert.equal(answerService.normalizeAnswerString('çãúâAñö çñ'), 'cauaano cn')
        })
      })

      describe('and is a number', () => {
        it('should convert number into a string', () => {
          assert.equal(answerService.normalizeAnswerString(12345), '12345')
        })
      })
    })
  })

  describe('keywordsEntries(step)', () => {
    describe('when the param is not present', () => {
      it('should return an empty array', () => {
        answerService
          .keywordsEntries('')
          .should.be.an('array')
          .with.lengthOf(0)
      })
    })

    describe('when the param is present', () => {
      describe('and the step not exists in json', () => {
        it('should return an empty array', () => {
          answerService
            .keywordsEntries('xyz')
            .should.be.an('array')
            .with.lengthOf(0)
        })
      })

      describe('and the value exists in json', () => {
        const { categorias } = keywordsData

        it('should return correct array length for categories', () => {
          answerService
            .keywordsEntries('categorias')
            .should.be.an('array')
            .with.lengthOf(Object.entries(categorias).length)
        })
      })
    })
  })

  describe('testAnswer(answer, key)', () => {
    describe('when the params are not present', () => {
      it('should return zero', () => {
        assert.equal(answerService.testAnswer('', null), 0)
      })
    })

    describe('when the params are present', () => {
      describe('and value don`t matches', () => {
        it('should return zero', () => {
          assert.equal(answerService.testAnswer('value', 'xyz'), 0)
        })
      })

      describe('and value matches', () => {
        it('should return 1', () => {
          assert.equal(answerService.testAnswer('value matches', 'value'), 1)
        })
      })
    })
  })

  describe('assurance(answer, points)', () => {
    describe('when the params are not present', () => {
      it('should return zero', () => {
        assert.equal(answerService.assurance('', 0), 0)
      })
    })

    describe('when the params are present', () => {
      describe('and the text is fully matched', () => {
        it('should return 1.0', () => {
          assert.equal(answerService.assurance('lorem ipsum dolor', 3), 1.0)
        })
      })

      describe('and the text is partial matched', () => {
        it('should return 0.5', () => {
          assert.equal(answerService.assurance('lorem ipsum', 1), 0.5)
        })

        it('should return 0.33', () => {
          assert.equal(answerService.assurance('lorem ipsum dolor', 1), 0.33)
        })
      })
    })
  })

  describe('checkStepKeywords(answer, step)', () => {
    describe('when the params are not present', () => {
      it('should return an empty object', () => {
        expect(answerService.checkStepKeywords('', '')).to.be.empty
      })
    })

    describe('when the params are present', () => {
      it('should have correct entries for categories', () => {
        const keys = Object.keys(keywordsData.categorias)
        expect(answerService.checkStepKeywords('', 'categorias')).to.have.all.keys(keys)
      })
    })
  })

  describe('mostCompatible(summary)', () => {
    describe('when the param is not present', () => {
      it('should return null', () => {
        assert.equal(answerService.mostCompatible(null), null)
      })
    })

    describe('when the param is present', () => {
      it('should return a', () => {
        const summary = { a: 1.0, b: 0.8, c: 0.9 }
        assert.equal(answerService.mostCompatible(summary), 'a')
      })

      it('should return c', () => {
        const summary = { a: 0.1, b: 0.8, c: 1.0 }
        assert.equal(answerService.mostCompatible(summary), 'c')
      })
    })
  })

  describe('classifyStep(answer, step)', () => {
    describe('when the params are not present', () => {
      it('should return null', () => {
        assert.equal(answerService.classifyStep('', ''), null)
      })
    })

    describe('when the params are present', () => {
      describe('and the step is categories', () => {
        it('should return a-mrv', () => {
          const answer = keywordsData.categorias['a-mrv'].toString()
          assert.equal(answerService.classifyStep(answer, 'categorias'), 'a-mrv')
        })

        it('should return usabilidade', () => {
          const answer = keywordsData.categorias.usabilidade.toString()
          assert.equal(answerService.classifyStep(answer, 'categorias'), 'usabilidade')
        })
      })
    })
  })

  describe('classifyType(nps)', () => {
    describe('when the params are not present', () => {
      it('should return null', () => {
        assert.equal(answerService.classifyType(null), null)
      })
    })

    describe('when the params are present', () => {
      it('should return promoter', () => {
        assert.equal(answerService.classifyType(10), 'promoter')
        assert.equal(answerService.classifyType(9), 'promoter')
      })

      it('should return neutral', () => {
        assert.equal(answerService.classifyType(8), 'neutral')
        assert.equal(answerService.classifyType(7), 'neutral')
      })

      it('should return detractor', () => {
        assert.equal(answerService.classifyType(6), 'detractor')
      })
    })
  })

  describe(' classify(answer)', () => {
    describe('when the param comment is not present', () => {
      it('should return an empty object', () => {
        expect(answerService.classify({ a: 1, b: 2 })).to.be.empty
      })
    })

    describe('when the param is present', () => {
      it('should have correct entries for epics', () => {
        const keys = ['comment', 'category', 'type']
        expect(answerService.classify({ comment: 'xyz' })).to.have.all.keys(keys)
      })
    })
  })
})
