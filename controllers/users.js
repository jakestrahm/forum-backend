const asyncHandler = require('../middleware/async')
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path')

// @desc get all users 
// @route get /api/v1/users
// @access private
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
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
    let user = await User.findById(req.params.id)

    if (!user) {
        return next(
            new ErrorResponse(`user with id ${req.params.id} not found`, 404)
        )
    }

    user = await User.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: user
    });

});

// @desc delete user by id
// @route delete /api/v1/users/:id
// @access private
exports.deleteUser = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorResponse(`user with id ${req.params.id} not found`, 404)
        )
    }

    //check if user should be able to perform operation 
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `user ${req.user.id} is not authorized to access this route`,
                401
            )
        );
    }

    user.remove();

    res.status(200).json({
        success: true,
        data: {}
    })
});

// @desc upload photo
// @route put /api/v1/users/:id/photo
// @access private
exports.userPhotoUpload = asyncHandler(async (req, res, next) => {
    const user = req.user
    /* const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorResponse(`user with id ${req.params.id} not found`, 404)
        )
    } */

    //check if user should be able to perform operation 
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `user ${req.user.id} is not authorized to access this route`,
                401
            )
        );
    }

    if (!req.files) {
        return next(
            new ErrorResponse(`upload a file`, 404)
        )
    }

    const file = req.files.file;

    //ensure image is a photo 
    if (!file.mimetype.startsWith('image')) {
        return next(
            new ErrorResponse(`upload a an image file`, 400)
        )
    }

    //limit filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(`upload a an image less than ${process.env.MAX_FILE_UPLOAD}`, 400)
        )
    }

    //create custom file name
    file.name = `photo_${user._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(
                new ErrorResponse(`image upload failed${process.env.MAX_FILE_UPLOAD}`, 500)
            )
        }

        await User.findOneAndUpdate(req.params.id, { photo: file.name })

        res.status(200).json({
            success: true,
            data: file.name
        })
    })

});
