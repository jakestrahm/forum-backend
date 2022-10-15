const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse');
const Post = require('../models/Post')

// @desc get all posts 
// @route get /api/v1/posts
// @route get /api/v1/users/:userId/posts
// @access private
exports.getPosts = asyncHandler(async (req, res, next) => {
    //create variable for storing query
    let query;

    //create copy of req.query
    let reqQuery = { ...req.query }

    //"all posts by a user"
    if (req.params.userId) {
        reqQuery = { ...reqQuery, user: req.params.userId }
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
    query = Post.find(JSON.parse(queryStr))

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
    const total = await Post.countDocuments();

    query = query.skip(startIndex).limit(limit);


    //execute query
    const posts = await query;

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
        count: posts.length,
        pagination: pagination,
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
