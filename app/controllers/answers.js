const trackSaleService = require('../services/thirdParty/trackSale')

module.exports = {
  forceUpdate(_, res) {
    trackSaleService
      .updateDatabase()
      .then(() => {
        return res.status(204).send()
      })
      .catch(err => {
        return res.status(422).send(err)
      })
  }
}
