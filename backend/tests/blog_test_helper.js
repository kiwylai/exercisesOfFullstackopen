const Blog = require('../models/blog')

const initialBlogs = require('./blogsData')
async function populateDatabase() {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
}
const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, populateDatabase
}