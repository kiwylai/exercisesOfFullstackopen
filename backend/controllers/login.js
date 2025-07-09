const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }
  console.log('user: ',user)
  const token = {
    username: user.username,
    id: user._id,
  }
  console.log('secret: ',process.env.SECRET)
  const encodedToken = jwt.sign(
    payload = token,
    secretOrPrivateKey = process.env.SECRET,
    options = { expiresIn: 60*60 }
  )

  response
    .status(200)
    .send({ token: encodedToken, username: user.username, name: user.name })
})

module.exports = loginRouter