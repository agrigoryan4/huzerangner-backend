const Post = require('../models/Post');

const getPosts = async (req, res) => {
  let { all, query, page, limit } = req.query;
  if(!page) page = 1;
  if(!limit) limit = 50;
  let posts, count;
  if (all) {
    posts = await Post.find(
      {}, 
      { title: 1, tags: 1, createdAt: 1, lastEdited: 1 }
    ).sort({ createdAt: -1 }).skip((page-1) * limit).limit(1 * limit);
    count = await Post.countDocuments({});
  }
  else if (query) {
    posts = await Post.find(
      {
        $text: {
          // $search: `\"${query}\"`,
          $search: query,
          $language: 'none',
          $caseSensitive: false
        },
      },
      { title: 1, tags: 1, createdAt: 1, lastEdited: 1 }
    ).skip((page-1) * limit).limit(1 * limit);
    count = await Post.countDocuments(
      {
        $text: {
          // $search: `\"${query}\"`,
          $search: query,
          $language: 'none',
          $caseSensitive: false
        },
      }
    );
  }
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