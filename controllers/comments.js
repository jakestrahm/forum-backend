const asyncHandler = require('../middleware/async')
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const ErrorResponse = require('../utils/errorResponse');

// @desc get all comments 
// @route get /api/v1/comments
// @route get /api/v1/posts/:postId/comments
// @access private
exports.getComments = asyncHandler(async (req, res, next) => {
    //check which route is being accessed
    if (req.params.postId) {
        const comments = await Comment.find({ post: req.params.postId })

        return res.status(200).json({
            success: true,
            count: comments.length,
            data: comments
        })
    } else {
        res.status(200).json(res.advancedResults)
    }

});

// @desc get comment by id
// @route get /api/v1/comments/:id
// @access private
exports.getComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.id)

    if (!comment) {
        return next(new ErrorResponse(`no comment with id of ${req.params.id}`), 404)
    }

    res.status(200).json({
        success: true,
        data: comment
    })
});

// @desc post new comment
// @route post /api/v1/posts/:postId/comments
// @access private
exports.postComment = asyncHandler(async (req, res, next) => {

    //set body.post = postId in param
    req.body.user = req.user.id
    req.body.post = req.params.postId

    //try to find post in db
    const post = await Post.findById(req.params.postId)

    //check if post exists
    if (!post) {
        return next(
            new ErrorResponse(`post with id ${req.params.postId} not found`, 404)
        )
    }


    const comment = await Comment.create(req.body)

    res.status(201).json({
        success: true,
        data: comment
    });
});

// @desc put comment by id
// @route put /api/v1/comments/:id
// @access private
exports.putComment = asyncHandler(async (req, res, next) => {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
        return next(
            new ErrorResponse(`No comment with the id of ${req.params.id}`, 404)
        );
    }

    // make sure user is comment owner
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update comment ${comment._id}`,
                401
            )
        );
    }

    comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    comment.save();

    res.status(200).json({
        success: true,
        data: comment
    });
});

// @desc delete comment by id
// @route delete /api/v1/comments/:id
// @access private
exports.deleteComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.id)

    if (!comment) {
        return next(
            new ErrorResponse(`comment with id ${req.params.id} not found`, 404)
        )
    }

    //check if user should be able to perform operation 
    if (req.user.id !== comment.user.toString() && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `user ${req.user.id} is not authorized to access this route`,
                401
            )
        );
    }

    await comment.remove();

    res.status(200).json({
        success: true,
        data: {}
    })
});

