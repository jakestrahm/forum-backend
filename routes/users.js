const express = require('express');
const {
    userPhotoUpload,
    getUser,
    getUsers,
    postUser,
    putUser,
    deleteUser } = require('../controllers/users')

const User = require('../models/User')
const advancedResults = require('../middleware/advancedResults')
const { protect, authorize } = require('../middleware/auth')

//include other resource routers
const postRouter = require('./posts')

const router = express.Router();

//re-route into other resource routers
router.use('/:userId/posts', postRouter)
router.route('/:id/photo').put(protect, userPhotoUpload)

router
    .route('/')
    .get(advancedResults(User, 'posts'), getUsers)
    .post(postUser)

router
    .route('/:id')
    .get(getUser)
    .put(protect, authorize('admin'), putUser)
    .delete(protect, authorize('admin'), deleteUser)

module.exports = router;
