const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.errorMessage)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.errorMessage })
  } else if (error.name === 'MongoServerError' && error.errorMessage.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  } else {
    console.log('middleware error: ',error)
  }

  next(error)
}

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
const tokenExtractor = async (request, response, next) =>
{
  let jsonWebToken = getTokenFrom(request)
  if (jsonWebToken === null || jsonWebToken === undefined) {
    next()
    return
  }

  const decodedToken = jwt.verify(jsonWebToken, process.env.SECRET)
  request.token = decodedToken ? decodedToken : null

  next()
}

const userExtractor = async (request, response, next) => {
  let token = request.token
  if (!token) {
    return response.status(401).json({ error: 'user has to be logged in' })
  }
  const user = await User.findById(token.id)
  request.user = user ? user : null
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}