const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async')
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail')

// @desc register userG
// @route post /api/v1/auth/register
// @access public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    })

    sendTokenResponse(user, 200, res)
})


// @desc log user in
// @route post /api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    //validate email and pass
    if (!email || !password) {
        return next(new ErrorResponse('provide an email and password', 400))
    }

    //check for user
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorResponse('invalid credentials', 401))
    }

    //check if password matches 
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
        return next(new ErrorResponse('invalid credentials', 401))
    }

    sendTokenResponse(user, 200, res)
})


// @desc get current logged in user
// @route post /api/v1/auth/me
// @access private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        sucess: true,
        data: user
    })
})

// @desc forgot password
// @route post /api/v1/auth/forgotpassword
// @access public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorResponse('no user with entered email'), 404)
    }

    //get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false })

    //create reset url
    const resetUrl = `${req.protocol}//${req.get('host')}/api/v1/resetpassword/${resetToken}`

    const message = `this will be converted to a front end link, for now it's url that requires a call ${resetUrl}`

    try {
        await sendEmail({
            email: user.email,
            subject: 'password reset token',
            message
        })

        res.status(200).json({
            success: true,
            data: 'email sent'
        })
    } catch {
        console.log(err)
        user.reset_password_token = undefined
        user.reset_password_expire = undefined

        await user.save({ validateBeforeSave: false })

        return next(new ErrorResponse('email failed to send'), 500)
    }

    res.status(200).json({
        sucess: true,
        data: user
    })
})

// get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //create token 
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })

}
