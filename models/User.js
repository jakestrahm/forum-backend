const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'a name is required'],
        trim: true,
        maxLength: [30, 'display name cannot exceed 30 characters']
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
    reset_password_token: String,
    reset_password_expire: Date,
    reputation: {
        type: Number,
        default: 0
    },
    creation_date: {
        type: Date,
        default: Date.now
    },
})

//TODO password encryption, tokens etc
//https://github.com/PacktPublishing/Node.js-API-Masterclass-with-Express-and-MongoDB/blob/master/models/User.js

module.exports = mongoose.model('User', UserSchema)

