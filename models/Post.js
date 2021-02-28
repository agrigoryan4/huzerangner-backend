const mongoose = require('mongoose');

const Post = mongoose.model('post', {
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
});

module.exports = Post;