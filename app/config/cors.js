const cors = require('cors')

const { NODE_ENV } = process.env

module.exports = {
  whitelist() {
    return [/growth\.d3\.do/]
  },

  options() {
    return {
      origin: (origin, callback) => {
        if (NODE_ENV != 'production' || this.whitelist().indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      }
    }
  },

  configure() {
    return cors(this.options())
  }
}
