const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const registerRoutesForPersonsIn = require('./phonebook_backend')

app.use(cors())
app.use(express.json())
morgan.token('type', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :type`))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

registerRoutesForPersonsIn(app)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})