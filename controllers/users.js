const asyncHandler = require('../middleware/async')
const User = require('../models/User');
const ErrorResppnse = require('../utils/errorResponse');


// @desc get user by id
// @route get /api/v1/users/:id
// @access private
exports.getUser = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            //if it is a formatted objectid but not in database
            return next(new ErrorResppnse(`user with id of ${req.params.id} not found`, 404))
        }

        res.status(200).json({
            success: true,
            data: user
        })
    } catch (err) {
        /*for errors returned by asynchronous functions invoked by route handlers or middleware
        you pass the error to the next() function where express will catch and process them*/

        //if it is not a formatted objectid
        next(new ErrorResppnse(`user with id of ${req.params.id} not found`, 404))
    }
});

// @desc get all users 
// @route get /api/v1/users
// @access private
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({ success: true, data: users })
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

// @desc put user by id
// @route put /api/v1/users/:id
// @access private
exports.putUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    })
});

// @desc delete user by id
// @route delete /api/v1/users/:id
// @access private
exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    })
});
