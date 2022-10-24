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
        /*owner's should be able to delete posts/comments they own
        * is that handled here? or only render the delete button if the person viewing has
        * the user id associated with the comment or post?
        */
        enum: ['user', 'admin'], //admin is done in compass, is this pointless?
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
    reputation: {
        type: Number,
        default: 0
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
},
    //TODO fix: this change has caused an extra id field
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

//reverse populate with virtuals
UserSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'user',
    justOne: false
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

//generate and has password token
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

