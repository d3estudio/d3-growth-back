const router = require('express').Router()
const answersController = require('../controllers/answers')

router.use('/answers/classify', answersController.classify)

module.exports = router
