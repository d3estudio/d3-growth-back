const moment = require('moment')

const answersHelper = require('./answers')

module.exports = {
  termToQuery(term) {
    const normalizedTerm = answersHelper.normalizeAnswerString(term)
    const defaultQuery = [{ comment: { $ne: null } }]

    if (!normalizedTerm) {
      return defaultQuery
    }

    return (`${normalizedTerm}`.trim().split(' ') || []).reduce((prev, current) => {
      return [
        ...prev,
        {
          normalizedComment: new RegExp(current)
        }
      ]
    }, defaultQuery)
  },

  categoriesToQuery(categories) {
    if (!categories) {
      return []
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
    const $gte = moment(startDate || '1970-01-01')
      .startOf('day')
      .add(3, 'hours')
      .toDate()

    const $lte = moment(endDate)
      .endOf('day')
      .add(3, 'hours')
      .toDate()

    return [{ date: { $gte } }, { date: { $lte } }]
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

    const query = { $and }

    if ($or.length) {
      return {
        ...query,
        $or
      }
    }

    return query
  }
}
