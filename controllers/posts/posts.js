const Post = require('../../models/Post');
const postsProjection = require('./postsProjection');

/**
 * fetches posts from the whole collection
 * @param {number} page 
 * @param {number} limit 
 */
const queryAll = async (page, limit) => {
  const posts = await Post.find({}, postsProjection)
  .sort({ createdAt: -1 }).skip((page-1) * limit).limit(1 * limit);
  const count = await Post.countDocuments({});

  return { posts, count };
};

/**
 * fetches posts with a given tag
 * @param {string} tag 
 * @param {number} page 
 * @param {number} limit 
 */
const queryByTag = async (tag, page, limit) => {
  const filter = {
    tags: tag
  }

  const posts = await Post.find(filter, postsProjection)
  .sort({ createdAt: -1 }).skip((page-1) * limit).limit(1 * limit);
  const count = await Post.countDocuments(filter);

  return { posts, count };
};

/**
 * fetches posts with a given search query
 * @param {string} keyword 
 * @param {number} page 
 * @param {number} limit 
 */
const queryByKeyword = async (keyword, page, limit) => {
  const filter = {
    $text: {
      // $search: `\"${keyword}\"`,
      $search: keyword,
      $language: 'none',
      $caseSensitive: false
    },
  }
  const posts = await Post.find(filter, postsProjection)
  .sort({ createdAt: -1 }).skip((page-1) * limit).limit(1 * limit);
  const count = await Post.countDocuments(filter);

  return { posts, count };
};


/**
 * handles requests for several posts 
 */
const getPosts = async (req, res) => {
  let { all, query, page, limit } = req.query;
  // if no page or limit is specified
  if(!page) page = 1;
  if(!limit) limit = 50;

  let posts, count;
  if (all) {
    const result = await queryAll(page, limit);
    posts = result.posts;
    count = result.count;
  }
  else if (query) {
    if(query.split(':')[0] === 'tag') {
      const result = await queryByTag(query.split(':')[1], page, limit);
      posts = result.posts;
      count = result.count;
    } else {
      const result = await queryByKeyword(query, page, limit);
      posts = result.posts;
      count = result.count;
    }
  } 
  const response = {
    posts: posts,
    inTotal: count
  }
  res.status(200).json(response);
};

module.exports.getPosts = getPosts;
