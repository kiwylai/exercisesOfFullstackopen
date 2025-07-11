const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    _id: '686fa07e7338ffc1af5e5e46',
    content: 'HTML is easy',
    user: '686f9b14ae598e47b73ddbb4',
    important: false
  },
  {
    _id: '686fa07e7338ffc1af5e5e47',
    content: 'Browser can execute only JavaScript',
    user: '686f9b14ae598e47b73ddbb4',
    important: true
  },
  {
    _id: '686fa134b506f6614a2aa5a2',
    content: 'HTML is not easy',
    user: '686bafd8a6040be0a656081b',
    important: true
  },
  {
    _id: '686fa134b506f6614a2aa5a3',
    content: 'Browser can not execute only JavaScript',
    user: '686bafd8a6040be0a656081b',
    important: false
  }
]

async function populateDatabase() {
  await Note.deleteMany({})
  await Note.insertMany(initialNotes)
}

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
  populateDatabase
}