const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('./blogsData')

describe('favorite blog', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.favoriteBlog(blogs)
    console.log(result)
    assert.deepStrictEqual(result.title, 'Canonical string reduction')
  })

  test('when list has many blogs, equals the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    console.log(result)
    assert.strictEqual(result.likes, 12)
  })
})