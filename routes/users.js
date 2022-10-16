const express = require('express');
const {
    userPhotoUpload,
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

router.route('/:id/photo').put(userPhotoUpload)

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
