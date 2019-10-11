module.exports = {
  normalizeAnswerString(answer) {
    return `${answer}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  },

  handleSummaryFromDb(docs) {
    return (docs || []).reduce(
      (previous, current) => {
        const { _id: type, count } = current

        return {
          ...previous,
          total: previous.total + count,
          [type]: count
        }
      },
      { total: 0 }
    )
  },

  calculateNps(summary) {
    const { promoter, detractor, total } = summary
    return Math.round(((promoter - detractor) / total) * 100)
  },

  termToQuery(term) {
    const normalizedTerm = this.normalizeAnswerString(term)

    return (`${normalizedTerm}`.trim().split(' ') || []).map(item => {
      return {
        normalizedComment: new RegExp(item)
      }
    })
  }
}
