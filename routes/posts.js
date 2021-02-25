const express = require('express');
const { getPosts, getPostSingle } = require('../controllers/posts');

const router = express.Router();

router.get('/:page', getPosts);
router.get('/post/:id', getPostSingle);

module.exports = router;