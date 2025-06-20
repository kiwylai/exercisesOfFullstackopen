const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most blogs', () => {
  const blogs = require('./blogsData')

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.mostBlogs(blogs)
    console.log(result)
    assert.deepStrictEqual(result.author, 'Robert C. Martin')
  })

  test('of a list with multiple blogs, equals the blog with most likes', () => {
    const result = listHelper.mostBlogs(blogs)
    const expected = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    assert.deepStrictEqual(result, expected)
  })
})