const Post = require('../../models/Post');
const postsProjection = require('./postsProjection');

const getSingle = async (_id) => {
  const post = await Post.findOne({ _id });
  return post;
};

const getSimilar = async (_id) => {
  const post = await Post.findOne({ _id });
  let result = [];
  const n = post.tags.length;
  // console.log(post.tags)
  for(let i = 0; i < n; i++) {
    const similarPosts = await Post.find(
      {
        tags: post.tags[i]
      },
      postsProjection
    );
    // console.log(similarPosts)
    result = result.concat(similarPosts);
    // console.log(result)
  }
  console.log(result);
  let newResults = result;
  if(result.length) {
    newResults = [];
    result.forEach((post, index) => {
      let indexAt = null;
      for(let i = 0; i < newResults.length; i++) {
        if(newResults[i]._id === post._id) {
          indexAt = i;
        }
      };
      // console.log(indexAt);
      if(indexAt !== null) {
        newResults[indexAt].relevance = newResults[indexAt].relevance + 1;
      } else {
        newResults.push({ ...post, relevance: 1 });
      }
    });
    // console.log(newResults);
  }
  // if(post.tags) {
  //   post.tags.forEach((tag, index) => {

  //   });
  // }
  
  return newResults;
};


// single post
const getPostSingle = async (req, res) => {
  const {id: _id, single, similar} = req.query;
  let result;
  if(single) result = await getSingle(_id);
  if(similar) result = await getSimilar(_id);
  if(!result) res.status(404).json('Not found');
  res.status(200).json(result);
};

module.exports.getPostSingle = getPostSingle;