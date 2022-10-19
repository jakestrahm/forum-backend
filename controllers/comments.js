const asyncHandler = require('../middleware/async')
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const ErrorResponse = require('../utils/errorResponse');

// @desc get all comments 
// @route get /api/v1/comments
// @route get /api/v1/posts/:postId/comments
// @access private
exports.getComments = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
});

// @desc get comment by id
// @route get /api/v1/comments/:id
// @access private
exports.getComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.id).populate('post');

    if (!comment) {
        return next(new ErrorResponse(`no comment with id of ${req.params.id}`), 404)
    }

    res.status(200).json({
        success: true,
        data: comment
    })
});

// @desc create new comment
// @route comment /api/v1/posts/:postId/comments
// @access private
exports.postComment = asyncHandler(async (req, res, next) => {

    //set post = param in body
    req.body.post = req.params.postId
    const post = await Post.findById(req.params.postId)

    //check if user exists
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
    let comment = await Comment.findById(req.params.id)

    if (!comment) {
        return next(
            new ErrorResponse(`comment with id ${req.params.id} not found`, 404)
        )
    }

    comment = await Comment.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

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

    await comment.remove();

    res.status(200).json({
        success: true,
        data: {}
    })
});

