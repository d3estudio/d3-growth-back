const router = require('express').Router()

const cors = require('../config/cors')
const passport = require('../config/passport')

const answers = require('./answers')
const auth = require('./auth')
const overview = require('./overview')

router.use(cors.configure())

router.use('/auth', auth)
router.use('/version', (req, res) => res.send({ version: '1.0.0' }))

// router.use('/', passport.authenticate('bearer', { session: false })) # temporary
router.use('/answers', answers)
router.use('/overview', overview)

module.exports = router
