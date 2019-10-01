const router = require('express').Router()

const answersController = require('../controllers/answers')
const passport = require('../config/passport')

router.use('/', passport.authenticate('bearer', { session: false }))
router.use('/answers/classify', answersController.classify)

module.exports = router
