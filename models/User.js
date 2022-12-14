const crypto = require('crypto')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'a name is required'],
        trim: true,
        maxLength: [30, 'display name cannot exceed 30 characters']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    about_me: {
        type: String,
        required: false
    },
    email: {
        type: String,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'enter a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'a password is required'],
        minlength: 6,
        select: false
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    reset_password_token: String,
    reset_password_expire: Date,
    creation_date: {
        type: Date,
        default: Date.now
    }
})

//encrypt pass
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

//sign jwt and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}

//match user entered password to hashed password in db
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
    //generate token 
    const resetToken = crypto.randomBytes(20).toString('hex')

    console.log("resetToken", resetToken)

    //hash and set token
    this.reset_password_token = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    //set expire to ten minutes
    this.reset_password_expire = Date.now() + 10 * 60 * 1000

    return resetToken
}

module.exports = mongoose.model('User', UserSchema)

