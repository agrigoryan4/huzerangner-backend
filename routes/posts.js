const express = require('express');
const { getPosts, getPostSingle, getPostsByQuery } = require('../controllers/posts');

const router = express.Router();

router.get('/post/:id', getPostSingle);
router.get('/', getPosts);

module.exports = router;