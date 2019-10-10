const router = require('express').Router()

const controller = require('../controllers/overview')

router.get('/summary', controller.npsReport)
router.get('/details', controller.summary)

module.exports = router
