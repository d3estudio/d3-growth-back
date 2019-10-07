const passport = require('passport')
const BearerStrategy = require('passport-http-bearer')

const SECRET = process.env.SECRET

passport.use(
  new BearerStrategy((token, done) => {
    if (token === SECRET) {
      return done(null, { user: 'ok' })
    }

    return done()
  })
)

module.exports = passport
