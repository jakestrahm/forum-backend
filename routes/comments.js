const express = require('express');
const { getComment,
    getComments,
    postComment,
    putComment,
    deleteComment } = require('../controllers/comments')

const advancedResults = require('../middleware/advancedResults')
const Comment = require('../models/Comment')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .post(protect, authorize('admin'), postComment)
    .get(advancedResults(Comment), getComments)

router
    .route('/:id')
    .get(getComment)
    .put(protect, authorize('admin'), putComment)
    .delete(protect, authorize('admin'), deleteComment)

module.exports = router;

