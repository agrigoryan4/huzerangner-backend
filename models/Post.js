const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    text: true,
    required: true,
  },
  body: {
    type: String,
    text: true,
    required: true,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: null,
  },
  lastEdited: {
    type: Date,
    default: null,
  }
})

const Post = mongoose.model('post', postSchema);

module.exports = Post;