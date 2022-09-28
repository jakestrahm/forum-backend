const express = require('express');
const { getComment, getComments, postComment, putComment, deleteComment } = require('../controllers/comments')
const router = express.Router();

router
    .route('/')
    .post(postComment)
    .get(getComments)

router
    .route('/:id')
    .get(getComments)
    .put(putComment)
    .delete(deleteComment)

module.exports = router;

