const express = require('express');
const { getPost, getPosts, postPost, putPost, deletePost } = require('../controllers/posts')
const router = express.Router();

router
    .route('/')
    .post(postPost)
    .get(getPosts)

router
    .route('/:id')
    .get(getPost)
    .put(putPost)
    .delete(deletePost)

module.exports = router;
