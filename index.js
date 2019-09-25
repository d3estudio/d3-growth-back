const express = require('express')
const debug = require('debug')('d3-growth:app')

const app = express()
const port = 3000

app.listen(port, () => debug(`listening on port ${port}`))
