const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'text cannot be empty'],
    },
    score: {
        type: Number,
        default: 0
    },
    creation_date: {
        type: Date,
        default: Date.now
    },
    //refs
    //"all comments by user"
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    //"all comments on post"
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: true,
    }
})

module.exports = mongoose.model('Comment', CommentSchema)

