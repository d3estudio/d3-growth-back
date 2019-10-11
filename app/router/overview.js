const router = require('express').Router()

const controller = require('../controllers/overview')

router.get('/nps_report', controller.npsReport)
router.get('/summary', controller.summary)

module.exports = router
