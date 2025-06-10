const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const registerRoutesForNotesIn = require('./notesBackend')

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.get('/', (request, response) => {
  response.send('<h1>Note app</h1>')
})

registerRoutesForNotesIn(app)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
