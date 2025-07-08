const blogsRouter = require('express').Router()
const Blog  = require('../models/blog')
const User = require('../models/user')
const assert = require('node:assert')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const users = await User.find({})
  const authenticatedUser = users[0]
  assert(authenticatedUser !== undefined && authenticatedUser !== null)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: authenticatedUser.id
  })

  if (!blog.title || !blog.url) {
    response.status(400).end()
    return
  }

  const savedBlog = await blog.save()
  authenticatedUser.blogs = authenticatedUser.blogs.concat(savedBlog._id)
  await authenticatedUser.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', (request, response, next) => {
  const { title, author, url, likes } = request.body

  Blog.findById(request.params.id)
    .then(blog => {
      if (!blog) {
        return response.status(404).end()
      }

      blog.title = title
      blog.author = author
      blog.url = url
      blog.likes = likes

      return blog.save().then((updatedblog) => {
        response.status(200).json(updatedblog)
      })
    })
    .catch(error => next(error))
})

module.exports = blogsRouter