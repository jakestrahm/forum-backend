const express = require('express');
const { getComment,
    getComments,
    postComment,
    putComment,
    deleteComment } = require('../controllers/comments')

const advancedResults = require('../middleware/advancedResults')
const Comment = require('../models/Comment')

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .post(postComment)
    .get(advancedResults(Comment), getComments)

router
    .route('/:id')
    .get(getComment)
    .put(putComment)
    .delete(deleteComment)

module.exports = router;

