const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const SECRET = process.env.SECRET

module.exports = {
  signIn(req, res) {
    const { user, password } = req.body

    if (user == USER && password == PASSWORD) {
      return res.send({ token: SECRET })
    }

    return res.status(401).send()
  }
}
