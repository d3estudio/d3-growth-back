const bodyParser = require('body-parser')
const debug = require('debug')('d3-growth:app')
const express = require('express')

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, () => debug(`listening on port ${port}`))
