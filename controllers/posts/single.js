const Post = require('../../models/Post');
const postsProjection = require('./postsProjection');

/**
 * returns the post given its id
 * @param {string} _id 
 */
const getSingle = async (_id) => {
  const post = await Post.findOne({ _id });
  return post;
};

/**
 * returns similar posts to a given post, 
 * does "its best" to return exactly 5 results
 * @param {string} _id 
 */
const getSimilar = async (_id) => {
  // the post found with the _id
  const post = await Post.findOne({ _id });

  /* array that contains posts with matching tags, if N tags match,
  that post will appear in the array N times
  */
  let results = [];

  // database query for filling the array with matching tags
  // ||| EXPERIMENTAL ||| needs improvement, connecting to the db N times is slow
  for(let i = 0; i < post.tags.length; i++) {
    const similarPosts = await Post.find(
      {
        tags: post.tags[i]
      },
      postsProjection
    );
    results = results.concat(similarPosts);
  }

  // new array for getting relevance of the match
  let resultsMerged = [];
  if(results.length) {
    /* iterates over the the results array, and removes the repeated
    results by instead increasing the result's relevance 
    each time it's encountered in the array
    */
    results.forEach((post, index) => {
      let alreadyExistsIndex = resultsMerged.findIndex((elem, index) => {
        if(elem._id.equals(post._doc._id)) return true;
        else return false;
      });
      if(alreadyExistsIndex !== -1) {
        resultsMerged[alreadyExistsIndex].relevance++;
      }
      else {
        resultsMerged.push({...post._doc, relevance: 2});
      }
    });
  };

  // if there are less than 5 results
  if(resultsMerged.length < 5) {
    let deficit = 5 - resultsMerged.length;
    let moreResults = await Post.find(
      {
        $text: {
          $search: post._doc.title,
          $language: 'none',
          $caseSensitive: false
        }
      },
      postsProjection
    ).limit(deficit + 1);
    moreResults = moreResults.map((elem, index) => {
      return {
        ...elem._doc,
        relevance: 1
      }
    });
    resultsMerged = resultsMerged.concat(moreResults);
  }

  // if there are still less than 5 results
  if(resultsMerged.length < 5) {
    let randomPosts = await Post.aggregate(
      [ {$sample: { size: 10 }}, {$project: postsProjection} ]
    );
    randomPosts = randomPosts.map((elem, index) => {
      return { ...elem, relevance: 0 };
    });
    resultsMerged = resultsMerged.concat(randomPosts);
  }

  // removing the item itself from the array
  resultsMerged = resultsMerged.filter((elem, index) => {
    if(elem._id.equals(post._doc._id)) return false;
    else return true;
  });

  // sort the final array by relevance
  resultsMerged = resultsMerged.sort((elem1, elem2) => {
    if(elem1.relevance > elem2.relevance) return -1;
    else return 1;
  });

  // trim the array from the end if there are more than 5 results
  if(resultsMerged.length > 5) {
    resultsMerged = resultsMerged.slice(0, 5);
  }
  
  return resultsMerged;
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
