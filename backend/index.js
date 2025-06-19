require('dotenv').config()
require('./services/mongodb').initializeDB()
const express = require('express')
const morgan = require('morgan')
const app = express()
const registerRoutesForPersonsIn = require('./phonebook_backend')
const registerRoutesForNotesIn = require('./notesBackend')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(express.json())
app.use(express.static('dist'))
morgan.token('type', function (req) {
  return JSON.stringify(req.body)
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :type')
)

registerRoutesForPersonsIn(app)
registerRoutesForNotesIn(app)
app.use(errorHandler)
