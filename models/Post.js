const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'a title is required'],
        trim: true,
        maxLength: [150, 'title cannot exceed 150 characters']
    },
    slug: String, //url friendly title
    body: {
        type: String,
        required: [true, 'body cannot be empty'],
    },
    comment_count: {
        type: Number,
        default: 0
    },
    view_count: {
        type: Number,
        default: 0
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
    //"all posts by user"
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }

})

module.exports = mongoose.model('Post', PostSchema)

// TODO create slug
// https://github.com/PacktPublishing/Node.js-API-Masterclass-with-Express-and-MongoDB/blob/master/models/Bootcamp.js
