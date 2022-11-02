const express = require('express');
const {
    getPost,
    getPosts,
    postPost,
    putPost,
    deletePost } = require('../controllers/posts')
const Post = require('../models/Post')
const advancedResults = require('../middleware/advancedResults')
const { protect, authorize } = require('../middleware/auth')

//include other resource routers
const commentRouter = require('./comments')

const router = express.Router({ mergeParams: true });

//re-route into other resource routers
router.use('/:postId/comments', commentRouter)

router
    .route('/')
    .get(advancedResults(Post, 'comments'), getPosts)
    .post(protect, authorize('admin'), postPost)

router
    .route('/:id')
    .get(advancedResults(Post, 'comments'), getPost)
    .put(protect, authorize('admin'), putPost)
    .delete(protect, authorize('admin'), deletePost)

module.exports = router;
