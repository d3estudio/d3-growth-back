const bodyParser = require('body-parser')
const express = require('express')

const app = express()
const port = process.env.PORT

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, () => console.log(`listening on port ${port}`))
