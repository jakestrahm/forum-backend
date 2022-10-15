const mongoose = require('mongoose');
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
        enum: ['viewer', 'owner', 'admin'],
        default: 'viewer'
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
    }
},
    {
        /* toJSON: { virtuals: true },
        toObject: { virtuals: true } */
    })

//reverse populate with virtuals
/* UserSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'user',
    justOne: false
}) */

//TODO password encryption, tokens etc
module.exports = mongoose.model('User', UserSchema)

