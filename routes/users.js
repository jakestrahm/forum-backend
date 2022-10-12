const express = require('express');
const {
    getUser,
    getUsers,
    postUser,
    putUser,
    deleteUser } = require('../controllers/users')

//include other resource routers
const postRouter = require('./posts')

const router = express.Router();

//re-route into other resource routers
router.use('/:userId/posts', postRouter)

router
    .route('/')
    .get(getUsers)
    .post(postUser)

router
    .route('/:id')
    .get(getUser)
    .put(putUser)
    .delete(deleteUser)

module.exports = router;
