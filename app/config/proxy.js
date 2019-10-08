const axios = require('axios')

module.exports = (customHeaders = {}) =>
  axios.create({
    headers: {
      ...customHeaders,
      'Content-Type': 'application/json'
    },
    timeout: 5000
  })
