const bodyParser = require('body-parser')
const express = require('express')
const passport = require('passport')

const router = require('./app/router')

const app = express()
const port = process.env.PORT

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())

app.use(router)

app.listen(port, () => console.log(`listening on port ${port}`))

module.exports = app
