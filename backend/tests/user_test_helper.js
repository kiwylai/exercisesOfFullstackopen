const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialUsers = [
  {
    _id: '686f9b14ae598e47b73ddbb4',
    username: 'testuser',
    name: 'Ady',
    password: '123456',
    blogs: [
      '5a422a851b54a676234d17f7',
      '5a422aa71b54a676234d17f8',
      '5a422b891b54a676234d17fa'
    ],
    notes:[
      '686fa07e7338ffc1af5e5e46',
      '686fa07e7338ffc1af5e5e47'
    ]
  },
  {
    _id: '686bafd8a6040be0a656081b',
    username: 'gogogo',
    name: 'Amy',
    password: '09876a',
    blogs: [
      '5a422b3a1b54a676234d17f9',
      '5a422ba71b54a676234d17fb',
      '5a422bc61b54a676234d17fc'
    ],
    notes:[
      '686fa134b506f6614a2aa5a2',
      '686fa134b506f6614a2aa5a3'
    ]
  }
]

const createUser = async (user) => {
  const userObject = new User(user)
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(user.password, saltRounds)
  userObject.passwordHash = passwordHash
  await userObject.save()
  return userObject
}

const populateDatabase = async () => {
  await User.deleteMany({})
  for (let user of initialUsers) {
    await createUser(user)
  }
}

const loginUser = async (username, app) => {
  const user = initialUsers.find(user => user.username === username)
  const loginUser = {
    username: username,
    password: user.password
  }
  const result = await app.post('/api/login').send(loginUser)
  const token = result.body.token
  console.log('token: ',token)
  return token
}

const usersInDb = async () => {
  const users =await User
    .find({})
    .populate('blogs')
    .populate('notes')
  console.log('users: ',users)
  return users
}

module.exports = {
  initialUsers,
  createUser,
  populateDatabase,
  loginUser,
  usersInDb
}
