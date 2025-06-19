const Person = require('./models/person')
const getAllPersons = (_, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
}

const getInformation = (request, response) => {
  console.log('getInformation')
  // TODO fix implementation
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person)
    })
    .catch(() => {
      response.status(404).end()
    })
}

const getPerson = (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
}

const updatePerson = (request, response, next) => {
  const { name, number } = request.body
  const id = request.params.id

  Person.findById(id)
    .then((person) => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch((error) => next(error))
}

const createPerson = (request, response, next) => {
  const body = request.body
  console.log(body)
  if (!body || !body.name) {
    return response.status(400).json({ error: 'name missing' })
  }

  Person.findOne({ name: body.name }).then((existingperson) => {
    if (existingperson) {
      existingperson.number = body.number
      existingperson.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    } else {
      const person = new Person({
        name: body.name,
        number: body.number,
      })

      person
        .save()
        .then((savedPerson) => {
          response.json(savedPerson)
        })
        .catch((error) => next(error))
    }
  })
}

const deletePerson = (request, response, next) => {
  console.log('deletePerson')
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
}

const registerRoutesForPersonsIn = (app) => {
  app.get('/api/persons', getAllPersons)
  app.get('/info', getInformation)
  app.get('/api/persons/:id', getPerson)
  app.put('/api/persons/:id', updatePerson)
  app.post('/api/persons', createPerson)
  app.delete('/api/persons/:id', deletePerson)
}

module.exports = registerRoutesForPersonsIn
