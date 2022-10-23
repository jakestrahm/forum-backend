const express = require('express');
const {
    getPost,
    getPosts,
    postPost,
    putPost,
    deletePost } = require('../controllers/posts')
const Post = require('../models/Post')
const advancedResults = require('../middleware/advancedResults')

//include other resource routers
const commentRouter = require('./comments')

const router = express.Router({ mergeParams: true });
// const router = express.Router();

//re-route into other resource routers
router.use('/:postId/comments', commentRouter)

router
    .route('/')
    .get(advancedResults(Post), getPosts)
    .post(postPost)

router
    .route('/:id')
    .get(getPost)
    .put(putPost)
    .delete(deletePost)

module.exports = router;
