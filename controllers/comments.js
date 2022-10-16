const asyncHandler = require('../middleware/async')
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const ErrorResponse = require('../utils/errorResponse');

// @desc get all comments 
// @route get /api/v1/comments
// @route get /api/v1/posts/:postId/comments
// @access private
exports.getComments = asyncHandler(async (req, res, next) => {
    //create variable for storing query
    let query;

    //create copy of req.query
    let reqQuery = { ...req.query }

    //"all comments for a post"
    if (req.params.postId) {
        reqQuery = { ...reqQuery, post: req.params.postId }
    } else {
    }

    //exclude fields
    const excludeFields = ['select', 'sort', 'page', 'limit'];

    //loop over excludeFields and remove them from queryCopy
    excludeFields.forEach(param => delete reqQuery[param]);

    //transform into JSON string
    let queryStr = JSON.stringify(reqQuery);

    //recognize operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    //find resource
    query = Comment.find(JSON.parse(queryStr))

    //select
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields)
    }

    //sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        //if no sort passed, then sort by date
        query = query.sort('+creation_date')
    }

    //pagination 
    const page = parseInt(req.query.page, 10) || 1 //page 1 will be the default unless specified
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Comment.countDocuments();

    query = query.skip(startIndex).limit(limit);


    //execute query
    const comments = await query;

    //pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }


    res.status(200).json({
        success: true,
        count: comments.length,
        pagination: pagination,
        data: comments
    })

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

