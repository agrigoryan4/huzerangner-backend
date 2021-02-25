const mongoose = require('mongoose');

const Post = mongoose.model('post', {
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
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