const asyncHandler = require('../middleware/async')
const { checkPermissions } = require('../middleware/auth')
const ErrorResponse = require('../utils/errorResponse');
const Post = require('../models/Post')
const User = require('../models/User')

// @desc get all posts 
// @route get /api/v1/posts
// @route get /api/v1/users/:userId/posts
// @access private
exports.getPosts = asyncHandler(async (req, res, next) => {

    console.log("req.params.userId", req.params.userId)

    //check which route is being accessed
    if (req.params.userId) {
        //find all posts with "user" = userId
        const posts = await Post.find({ user: req.params.userId })

        return res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        })
    } else {
        res.status(200).json(res.advancedResults)
    }
});

// @desc get post by id
// @route get /api/v1/posts/:id
// @access private
exports.getPost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id)

    if (!post) {
        return next(new ErrorResponse(`no post with id of ${req.params.id}`), 404)
    }

    res.status(200).json({
        success: true,
        data: post
    })
});

// @desc create new post
// @route post /api/v1/posts
// @access private
exports.postPost = asyncHandler(async (req, res, next) => {
    console.log('req.user.id', req.user.id)

    req.body.user = req.user.id

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
    let post = await Post.findById(req.params.id);

    if (!post) {
        return next(
            new ErrorResponse(`No post with the id of ${req.params.id}`, 404)
        );
    }

    // make sure user is post owner
    if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update post ${post._id}`,
                401
            )
        );
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    post.save();

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

    //check if user should be able to perform operation 
    if (req.user.id !== post.user.toString() && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `user ${req.user.id} is not authorized to access this route`,
                401
            )
        );
    }

    await post.remove();

    res.status(200).json({
        success: true,
        data: {}
    })
});
