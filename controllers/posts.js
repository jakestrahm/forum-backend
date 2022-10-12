const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse');
const Post = require('../models/Post')

// @desc get all posts 
// @route get /api/v1/posts
// @route get /api/v1/users/:userId/posts
// @access private
exports.getPosts = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.userId) {
        query = Post.find({ user: req.params.userId })
    } else {
        query = Post.find();
    }

    const posts = await query;

    res.status(200).json({
        success: true,
        count: posts.length,
        data: posts
    })
});

// @desc get post by id
// @route get /api/v1/posts/:id
// @access private
exports.getPost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: post
    })
});

// @desc create new post
// @route post /api/v1/posts/
// @access private
exports.postPost = asyncHandler(async (req, res, next) => {
    const post = await Post.create(req.body);

    res.status(201).json({
        success: true,
        data: post
    });
});

// @desc put post by id
// @route put /api/v1/posts/:id
// @access private
exports.putPost = asyncHandler(async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: post
    })
});

// @desc delete post by id
// @route delete /api/v1/posts/:id
// @access private
exports.deletePost = asyncHandler(async (req, res, next) => {
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    })
});
