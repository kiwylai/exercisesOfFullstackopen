const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./blog_test_helper')
const Blog = require('../models/blog')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  console.log('response: ',response.body)
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier is id', async () => {
  const response = await helper.blogsInDb()
  const id = response[0].id
  assert(id !== undefined)
  assert(id !== null)
  assert(typeof id === 'string')
  assert(id.length > 0)
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'React patterns',
    author: 'Hanry Pork',
    url: 'https://reactpatterns.com/',
    likes: 7,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('React patterns'))
})

test('likes will be 0 when likes property is missing ', async () => {
  const newBlog = {
    title: 'Run away',
    author: 'Han Pork',
    url: 'https://runrunrun.com/'
  }

  const response =  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  console.log('response: ',response.body)
  assert.strictEqual(response.body.likes, 0)
})

after(async () => {
  await mongoose.connection.close()
})