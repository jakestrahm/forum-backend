const asyncHandler = require('../middleware/async')
const User = require('../models/User')

// @desc get all users 
// @route get /api/v1/users
// @access private
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({ success: true, data: users })
});

// @desc get user by id
// @route get /api/v1/users/:id
// @access private
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: user
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
