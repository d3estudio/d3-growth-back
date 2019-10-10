const router = require('express').Router()

const controller = require('../controllers/answers')

router.get('/force_update', controller.forceUpdate)

module.exports = router
