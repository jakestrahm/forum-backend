const express = require('express');
const { getComment, getComments, postComment, putComment, deleteComment } = require('../controllers/comments')

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .post(postComment)
    .get(getComments)

router
    .route('/:id')
    .get(getComment)
    .put(putComment)
    .delete(deleteComment)

module.exports = router;

