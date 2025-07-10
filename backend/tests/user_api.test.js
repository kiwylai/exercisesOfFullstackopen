const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./user_test_helper')
const mongoose = require('mongoose')
const api = supertest(app)

describe('when there is a populated userDatabase', () => {
  beforeEach(async () => {

    await helper.populateDatabase()
  })

  test('Users are returned as json', async () => {
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
}
)

after(async () => {
  await mongoose.connection.close()
})