const router = require('express').Router()

const answersController = require('../controllers/answers')
const auth = require('./auth')
const passport = require('../config/passport')

router.use('/auth', auth)
router.use('/version', (req, res) => res.send({ version: '1.0.0' }))

router.use('/', passport.authenticate('bearer', { session: false }))
router.use('/answers/classify', answersController.classify)

module.exports = router
