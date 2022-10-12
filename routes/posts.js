const express = require('express');
const {
    getPost,
    getPosts,
    postPost,
    putPost,
    deletePost } = require('../controllers/posts')

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getPosts)
    .post(postPost)

router
    .route('/:id')
    .get(getPost)
    .put(putPost)
    .delete(deletePost)

module.exports = router;
