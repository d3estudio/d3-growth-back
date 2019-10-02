const router = require('express').Router()

const controller = require('../controllers/auth')

router.post('/sign_in', controller.signIn)

module.exports = router
