const getAllNotes  =  (request, response) => {
  response.json(notes)
}

const getNote = (request, response) => {
  const id = request.params.id
  const note = notes.find((note) => note.id === id)
  console.log("Id is",id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
}

const updateNote = (request, response) => {
  const id = request.params.id
  const body = request.body
  const note = notes.find((note) => note.id === id)
  console.log("Id is",id)
  if (note) {
    note.content = body.content
    note.important = body.important
    response.json(note)
  } else {
    response.status(404).end()
  }
}

const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0
  return String(maxId + 1)
}

const createNote = (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
}

const deleteNote = (request, response) => {
  const id = request.params.id
  notes = notes.filter((note) => note.id !== id)

  response.status(204).end()
}

const registerRoutesForNotesIn = (app) => {
  app.get('/api/notes', getAllNotes)
  app.get('/api/notes/:id',getNote)
  app.put('/api/notes/:id',updateNote)
  app.post('/api/notes', createNote)
  app.delete('/api/notes/:id', deleteNote)
}

module.exports = registerRoutesForNotesIn

