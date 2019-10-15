module.exports = {
  normalizeAnswerString(answer) {
    if (!answer) {
      return ''
    }

    return `${answer}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  },

  calculateNps(summary) {
    const { promoter, detractor, total } = summary
    return Math.round(((promoter - detractor) / total) * 100)
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
  }
}
