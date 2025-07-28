const mongoose = require('mongoose')
const blogSchema = new mongoose.Schema({
  title: {
    minLength:1,
    type: String,
    required: true,
  },
  author: {
    minLength:1,
    type: String,
    required: true,
  },
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Blogs', blogSchema)
