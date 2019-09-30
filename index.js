const bodyParser = require('body-parser')
const express = require('express')

const router = require('./app/router')

const app = express()
const port = process.env.PORT

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(router)

app.listen(port, () => console.log(`listening on port ${port}`))
