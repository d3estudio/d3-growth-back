const bodyParser = require('body-parser')
const express = require('express')
const passport = require('passport')

const router = require('./app/router')

const trackSaleService = require('./app/services/thirdParty/trackSale')

const app = express()
const API_PORT = process.env.API_PORT

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())

app.use(router)

app.listen(API_PORT, () => console.log(`listening on port ${API_PORT}`))

trackSaleService
  .updateDatabase()
  .then(result => console.log('database updated'))
  .catch(err => console.error(err))

module.exports = app
