const User = require('../models/user')
const bcrypt = require('bcrypt')
const initialUsers = [
  {
    username: 'testuser',
    name: 'Ady',
    password: '123456'
  },
  {
    username: 'gogogo',
    name: 'Amy',
    password: '09876a'
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
  for (let user of initialUsers) {
    await createUser(user)
  }
}
module.exports = {
  initialUsers,
  createUser,
  populateDatabase,
}
