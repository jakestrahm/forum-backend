const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse');
const Post = require('../models/Post')
const User = require('../models/User')

// @desc get all posts 
// @route get /api/v1/posts
// @route get /api/v1/users/:userId/posts
// @access private
exports.getPosts = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
});

// @desc get post by id
// @route get /api/v1/posts/:id
// @access private
exports.getPost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate('user');

    if (!post) {
        return next(new ErrorResponse(`no post with id of ${req.params.id}`), 404)
    }

    res.status(200).json({
        success: true,
        data: post
    })
});

// @desc create new post
// @route post /api/v1/users/:userId/posts
// @access private
exports.postPost = asyncHandler(async (req, res, next) => {

    //set user = param in body
    req.body.user = req.params.userId
    const user = await User.findById(req.params.userId)

    //check if user exists
    if (!user) {
        return next(
            new ErrorResponse(`user with id ${req.params.userId} not found`, 404)
        )
    }

    const post = await Post.create(req.body)

    res.status(201).json({
        success: true,
        data: post
    });
});

// @desc put post by id
// @route put /api/v1/posts/:id
// @access private
exports.putPost = asyncHandler(async (req, res, next) => {

    let post = await Post.findById(req.params.id)

    if (!post) {
        return next(
            new ErrorResponse(`post with id ${req.params.id} not found`, 404)
        )
    }

    post = await Post.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: post
    });

});

// @desc delete post by id
// @route delete /api/v1/posts/:id
// @access private
exports.deletePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id)

    if (!post) {
        return next(
            new ErrorResponse(`post with id ${req.params.id} not found`, 404)
        )
    }

    await post.remove();

    res.status(200).json({
        success: true,
        data: {}
    })
});
