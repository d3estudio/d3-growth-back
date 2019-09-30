const answerService = require('../services/answer')

module.exports = {
  classify(req, res) {
    const answers = req.body
    const classified = answerService.classifyAll(answers)

    res.send(classified)
  }
}
