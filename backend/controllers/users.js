const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes',  {
      content: 1,
      important: 1
    }).populate('blogs')
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if (password.length < 3) {
    const error = new Error()
    error.message = 'password must be at least 3 characters long'
    error.name = 'ValidationError'
    throw error
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  console.log('passwordHash ',passwordHash)
  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

usersRouter.put('/:id', userExtractor, async (request, response) => {
  const { username, name, id } = request.body
  const loginUser = request.user

  if ( id !== loginUser.id.toString() ) {
    response.status(403).json({ error: 'you can change only your own username' })
  }

  const user = await User.findById(id)
  user.username = username
  user.name = name

  const savedUser = await user.save()
  response.status(200).json(savedUser)
})

module.exports = usersRouter