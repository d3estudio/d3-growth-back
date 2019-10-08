const AUTH_USER = process.env.AUTH_USER
const AUTH_PASSWORD = process.env.AUTH_PASSWORD
const TOKEN_SECRET = process.env.TOKEN_SECRET

module.exports = {
  signIn(req, res) {
    const { user, password } = req.body

    if (user == AUTH_USER && password == AUTH_PASSWORD) {
      return res.send({ token: TOKEN_SECRET })
    }

    return res.status(401).send()
  }
}
