const moment = require('moment')

const answersHelper = require('./answers')

module.exports = {
  termToQuery(term) {
    const normalizedTerm = answersHelper.normalizeAnswerString(term)

    if (!normalizedTerm) {
      return []
    }

    return (`${normalizedTerm}`.trim().split(' ') || []).map(item => {
      return {
        normalizedComment: new RegExp(item)
      }
    })
  },

  categoriesToQuery(categories) {
    if (!categories) {
      return [{}]
    }

    return `${categories}`
      .trim()
      .split(',')
      .map(category => {
        return {
          category
        }
      })
  },

  rangeToQuery(startDate, endDate) {
    const start = moment(startDate || '1970-01-01')
      .startOf('day')
      .toISOString()

    const end = moment(endDate)
      .endOf('day')
      .toISOString()

    return [{ date: { $gte: new Date(start) } }, { date: { $lte: new Date(end) } }]
  },

  sortByToQuery(sortBy, direction) {
    const sortableColumns = [
      'id',
      'campaign',
      'date',
      'user',
      'nps',
      'elapsedTime',
      'category',
      'type'
    ]

    const column = sortableColumns.includes(sortBy) ? sortBy : 'date'
    const dir = ['1', '-1'].includes(direction) ? direction : '-1'

    return {
      [column]: parseInt(dir)
    }
  },

  skipToQuery(page) {
    return (page || 0) * 10
  },

  limitToQuery() {
    return 10
  },

  requestParamsToQuery(params) {
    const { term, categories, start_date: startDate, end_date: endDate } = params || {}

    const $and = [...this.termToQuery(term), ...this.rangeToQuery(startDate, endDate)]
    const $or = [...this.categoriesToQuery(categories)]

    return {
      $and,
      $or
    }
  }
}
