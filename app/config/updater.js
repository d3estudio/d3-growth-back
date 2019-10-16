const CronJob = require('cron').CronJob

const trackSaleService = require('../services/thirdParty/trackSale')

const { NODE_ENV, TRACK_SALE_CRON } = process.env

module.exports = {
  scheduleAll() {
    if (NODE_ENV == 'test') {
      return
    }

    console.log('updater scheduled')
    this.updateDatabaseWithTrackSaleData()
  },

  updateDatabaseWithTrackSaleData() {
    return new CronJob({
      cronTime: TRACK_SALE_CRON,
      onTick: () => {
        trackSaleService.updateDatabase().catch(err => console.error(err))
      },
      start: true,
      timeZone: 'America/Sao_Paulo'
    })
  }
}
