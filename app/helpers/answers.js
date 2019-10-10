module.exports = {
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
  }
}
