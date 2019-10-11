const { AUTH_PASSWORD, AUTH_USER, TOKEN_SECRET } = process.env

module.exports = {
  signIn(req, res) {
    const { user, password } = req.body

    if (user == AUTH_USER && password == AUTH_PASSWORD) {
      return res.status(201).send({ token: TOKEN_SECRET })
    }

    return res.status(401).send()
  }
}
