const passport = require('passport')
const BearerStrategy = require('passport-http-bearer')

const secret = process.env.TOKEN_SECRET

passport.use(
  new BearerStrategy((token, done) => {
    if (token === secret) {
      return done(null, { user: 'ok' })
    }

    return done()
  })
)

module.exports = passport
