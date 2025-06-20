const _ = require('lodash')
const blogs = require('../tests/blogsData')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map(blog => blog.likes))
  return blogs.find(blog => blog.likes === maxLikes)
}

const mostBlogs = (blogs) => {
  const blogsByAuthor = _.groupBy(blogs, 'author')
  console.log('blogsByAuthor', blogsByAuthor)
  const authors = _.keys(blogsByAuthor)
  console.log('authors', authors)
  const authorWithMostBlogs = _.maxBy(authors, (author) => blogsByAuthor[author].length)
  console.log(authorWithMostBlogs)
  const result = {
    author: authorWithMostBlogs,
    blogs: blogsByAuthor[authorWithMostBlogs].length
  }
  return result
}

const mostLikes = (blogs) => {
  const blogsByAuthor = _.groupBy(blogs, 'author')
  console.log('blogsByAuthor', blogsByAuthor)
  const authorLikes = _.mapValues(blogsByAuthor, blogs => _.sumBy(blogs, 'likes'))
  console.log('authorLikes', authorLikes)
  const authorWithMostLikes = _.maxBy(_.keys(authorLikes), author => authorLikes[author])
  console.log('authorWithMostLikes', authorWithMostLikes)
  const result = {
    author: authorWithMostLikes,
    likes: authorLikes[authorWithMostLikes]
  }
  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
