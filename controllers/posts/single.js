const Post = require('../../models/Post');

// single post
const getPostSingle = async (req, res) => {
  const {id: _id} = req.params;
  const post = await Post.findOne({ _id });
  if(!post) res.status(404).json('Not found');
  res.status(200).json(post);
};

module.exports.getPostSingle = getPostSingle;