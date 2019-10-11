const keywords = require('../utils/keywords.json')
const answersHelper = require('../helpers/answers')

module.exports = {
  keywordsEntries(step) {
    return Object.entries(keywords[step] || {})
  },

  testAnswer(answer, key) {
    const regex = new RegExp(key)
    return regex.test(answersHelper.normalizeAnswerString(answer)) ? 1 : 0
  },

  assurance(answer, points) {
    const answerLength = `${answer}`
      .trim()
      .split(' ')
      .filter(word => word != '').length

    return answerLength > 0 ? Math.round((points / answerLength) * 100) / 100 : 0
  },

  checkStepKeywords(answer, step) {
    return this.keywordsEntries(step).reduce((summary, current) => {
      const [key, values] = current
      let points = 0

      values.forEach(keyword => {
        points += this.testAnswer(answer, keyword)
      })

      return {
        ...summary,
        [key]: this.assurance(answer, points)
      }
    }, {})
  },

  mostCompatible(summary) {
    const arraySummary = Object.entries(summary || {})
    const highestGrade = arraySummary
      .sort((a, b) => {
        return a[1] - b[1]
      })
      .pop()

    if (!highestGrade) {
      return null
    }

    return highestGrade[1] > 0.0 ? highestGrade[0] : null
  },

  classifyStep(answer, step) {
    const summary = this.checkStepKeywords(answer, step)
    return this.mostCompatible(summary)
  },

  classifyType(nps) {
    switch (true) {
      case nps >= 9:
        return 'promoter'
      case nps >= 7 && nps < 9:
        return 'neutral'
      default:
        return 'detractor'
    }
  },

  classify(answer) {
    return {
      ...answer,
      normalizedComment: answersHelper.normalizeAnswerString(answer['comment']),
      category: this.classifyStep(answer['comment'], 'categories'),
      type: this.classifyType(parseInt(answer['nps']))
    }
  }
}
