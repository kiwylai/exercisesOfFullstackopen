// noinspection JSUnresolvedReference

const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./user_test_helper')
const mongoose = require('mongoose')
const api = supertest(app)

describe('when there is a populated userDatabase', () => {
  beforeEach(async () => {

    await helper.populateDatabase()
  })

  test('Users are returned as json', async () => {
    // noinspection JSCheckFunctionSignatures
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Users must have an unique username', async () => {
    const newUser = helper.initialUsers[0]
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ error: 'expected `username` to be unique' })
  })

  test('Username must be more than 2 characters long', async () => {
    const newUser = {
      username: 'Ab',
      name: 'Matti',
      password: 'chinkem'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert(response.body.error.includes('username'))
    assert(response.body.error.includes('shorter'))
    assert(response.body.error.includes('3'))
  })

  test('Password must be more than 2 characters long', async () => {
    const newUser = {
      username: 'Abandon',
      name: 'Matti',
      password: 'ch'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert(response.body.error.includes('password'))
    assert(response.body.error.includes('3'))
  })

  describe('modification of a user', () => {
    test('modification fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()
      console.log('usersAtStart: ', usersAtStart)
      const updatedUser = usersAtStart[0]

      updatedUser.username = usersAtStart[1].username
      console.log('test: before', typeof updatedUser)
      const result = await api
        .put(`/api/users/${updatedUser.id}`)
        .send(updatedUser.toJSON())
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })

  test('modification succeed if user is logged in', async () => {
    const usersAtStart = await helper.usersInDb()
    console.log('usersAtStart: ', usersAtStart)
    const user = usersAtStart[0].toJSON()
    const token = await helper.loginUser(user.username, api)
    const newUsername = 'ppppppppppppppp'

    await api
      .put(`/api/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: user.id , username: newUsername, name: user.name })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    const dbUser = usersAtEnd.filter(user => user.id === user.id)[0]
    assert.strictEqual(dbUser.username, newUsername)
  })

  // todo: create a new test when the user is authenticated but a different user

  test('modification fails with proper status code and message if user is not logged in ', async () => {
    const usersAtStart = await helper.usersInDb()
    console.log('usersAtStart: ', usersAtStart)
    const updatedUser = usersAtStart[0].toJSON()

    updatedUser.username = 'ppppppppppppppp'
    await api
      .put(`/api/users/${updatedUser.id}`)
      .send(updatedUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    const dbUser = usersAtEnd.filter(user => user.id === updatedUser.id)[0]
    assert.strictEqual(dbUser.username, usersAtStart[0].username)
  })
}
)

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await helper.populateDatabase()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'chinkem'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})


after(async () => {
  await mongoose.connection.close()
})