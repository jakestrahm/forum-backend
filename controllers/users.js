const asyncHandler = require('../middleware/async')
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc get all users 
// @route get /api/v1/users
// @access private
exports.getUsers = asyncHandler(async (req, res, next) => {
    //TODO explain path querying to micha?

    //create variable for storing query
    let query;

    //create copy of req.query
    let reqQuery = { ...req.query }

    //exclude fields
    const excludeFields = ['select', 'sort', 'page', 'limit'];

    //loop over excludeFields and remove them from queryCopy
    excludeFields.forEach(param => delete reqQuery[param]);

    //stringify query string
    let queryStr = JSON.stringify(reqQuery);

    //recognize operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    //find resource
    query = User.find(JSON.parse(queryStr))

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
    const total = await User.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //execute query
    const users = await query;

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
        count: users.length,
        pagination: pagination,
        data: users
    })
});

// @desc create new user
// @route user /api/v1/users/
// @access private
exports.postUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
        success: true,
        data: user
    });
});

// @desc get user by id
// @route get /api/v1/users/:id
// @access private
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    //if it is a formatted objectid but not in database
    if (!user) {
        return next(
            new ErrorResponse(`user with id ${req.params.id} not found`, 404)
        )
    }

    res.status(200).json({
        success: true,
        data: user
    })
});


// @desc put user by id
// @route put /api/v1/users/:id
// @access private
exports.putUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return next(
            new ErrorResponse(`user with id ${req.params.id} not found`, 404)
        )
    }

    res.status(200).json({
        success: true,
        data: user
    })

});

// @desc delete user by id
// @route delete /api/v1/users/:id
// @access private
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(
            new ErrorResponse(`user with id ${req.params.id} not found`, 404)
        )
    }

    res.status(200).json({
        success: true,
        data: user
    })
});
