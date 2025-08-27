import axios from 'axios'
const baseUrl = '/api/blogs'
import loginService from './login.js'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getConfig = () => {
  const user = loginService.getUser()
  if (!user) {
    return
  }
  const config = {
    headers: { Authorization: `Bearer ${loginService.getUser().token}`},
  }
  return config;
}

const create = async newObject => {
  const response = await axios.post(baseUrl, newObject, getConfig())
  return response.data
}

const update = async (id, newObject) => {
  const response =
      await axios.put(`${baseUrl}/${id}`, newObject, getConfig())
  return response.data
}

const like = async (blog) => {
  const updatedBlog = {
    id: blog.id,
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes + 1
  }
  return update(blog.id, updatedBlog)
}

const remove = async (id) => {
  const config = getConfig()
  if (!config) {
    throw new Error('Authentication required')
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default {
  getAll,
  create,
  update,
  like,
  remove,
};