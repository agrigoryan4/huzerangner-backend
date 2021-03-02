const Post = require('../../models/Post');

// tags
const getTags = async (req, res) => {
  const allPosts = await Post.find(
    {},
    { tags: 1 }
  );
    
  // empty labels array
  let tags = [];
  /* for each post, check if it is already in the labels array,
  if it is, increment the number of posts it's been found in, otherwise
  create a new tag object in the array   
  */
  allPosts.forEach((post, index) => {
    post.tags.forEach((tag, index) => {
      if(tags.length > 0) {
        let alreadyFound = false;
        tags.forEach((elem, index) => {
          if(elem.tag === tag) {
            alreadyFound = true;
            elem.postsNumber++;
          }
        });
        if(!alreadyFound) {
          tags.push({ tag: tag, postsNumber: 1 });
        }
      }
      else tags.push({ tag: tag, postsNumber: 1 });
    });
  });

  res.status(200).json(tags);
};

module.exports.getTags = getTags;