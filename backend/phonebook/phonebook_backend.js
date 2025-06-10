let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const getAllPersons = (request, response) => {
  response.json(persons)
}

const getInformation = (request, response) => {
  const date = new Date()
  const formattedDate = date.toLocaleString('en-GB', {
    weekday: 'short',
    year: 'numeric',
    month: 'short', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'longOffset'
  })
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${formattedDate}</p>`)
}

const getPerson = (request, response) => {
  const id = request.params.id
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end('Page cannot found 404')
  }
}

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0
  return String(maxId + 1)
}

const createPerson = (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing',
    })
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique',
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)
  response.json(person)
}

const deletePerson = (request, response) => {
  const id = request.params.id
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end('Information deleted')
}

const registerRoutesForPersonsIn = (app) => {
  app.get('/api/persons', getAllPersons)
  app.get('/info', getInformation)
  app.get('/api/persons/:id', getPerson)
  app.post('/api/persons', createPerson)
  app.delete('/api/persons/:id', deletePerson)
}

module.exports = registerRoutesForPersonsIn 