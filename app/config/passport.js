const passport = require('passport')
const BearerStrategy = require('passport-http-bearer')

const TOKEN_SECRET = process.env.TOKEN_SECRET

passport.use(
  new BearerStrategy((token, done) => {
    if (token === TOKEN_SECRET) {
      return done(null, { user: 'ok' })
    }

    return done()
  })
)

module.exports = passport
