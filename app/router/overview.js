const router = require('express').Router()

const controller = require('../controllers/overview')

router.get('/summary', controller.summary)

module.exports = router
