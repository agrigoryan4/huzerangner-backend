const express = require('express');
const { getPosts, getPostSingle, getTags } = require('../controllers/posts');

const router = express.Router();

router.get('/post/:id', getPostSingle);
router.get('/tags/', getTags);
router.get('/', getPosts);

module.exports = router;