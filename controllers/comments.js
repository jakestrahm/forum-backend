const asyncHandler = require('../middleware/async')
const Comment = require('../models/Comment')

// @desc get all comments 
// @route get /api/v1/comments
// @access private
exports.getComments = asyncHandler(async (req, res, next) => {
    const comments = await Comment.find();
    res.status(200).json({ success: true, data: comments })
});

// @desc get comment by id
// @route get /api/v1/comments/:id
// @access private
exports.getComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: comment
    })
});

// @desc create new comment
// @route comment /api/v1/comments/
// @access private
exports.postComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.create(req.body);

    res.status(201).json({
        success: true,
        data: comment
    });
});

// @desc put comment by id
// @route put /api/v1/comments/:id
// @access private
exports.putComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: comment
    })
});

// @desc delete comment by id
// @route delete /api/v1/comments/:id
// @access private
exports.deleteComment = asyncHandler(async (req, res, next) => {
    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    })
});

