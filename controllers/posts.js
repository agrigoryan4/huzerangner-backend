const Post = require('../models/Post');

const getPosts = async (req, res) => {
  const { page } = req.params;
  const posts = await Post.find(
    {}, 
    { title: 1, tags: 1, createdAt: 1, lastEdited: 1 }
  ).sort({ createdAt: -1 }).skip((page-1) * 10).limit(10);
  const count = await Post.countDocuments({});
  const response = {
    posts: posts,
    inTotal: count
  }
  res.status(200).json(response);
};

const getPostSingle = async (req, res) => {
  const {id: _id} = req.params;
  const post = await Post.findOne({ _id });
  if(!post) res.status(404).json('Not found');
  res.status(200).json(post);
};

module.exports.getPosts = getPosts;
module.exports.getPostSingle = getPostSingle;