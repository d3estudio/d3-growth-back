const router = require('express').Router()

const controller = require('../controllers/answers')

router.get('/', controller.index)
router.get('/force_update', controller.forceUpdate)
router.get('/related_with', controller.relatedWith)

module.exports = router
