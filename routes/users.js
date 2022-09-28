const express = require('express');
const { getUser, getUsers, postUser, putUser, deleteUser } = require('../controllers/users')
const router = express.Router();

router
    .route('/')
    .post(postUser)
    .get(getUsers)

router
    .route('/:id')
    .get(getUser)
    .put(putUser)
    .delete(deleteUser)

module.exports = router;
