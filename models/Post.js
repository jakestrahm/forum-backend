const mongoose = require('mongoose')
const slugify = require('slugify');

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
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }

},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)
//TODO not working
//reverse populate with virtuals
PostSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    justOne: false
})

//create slug of post name
// arrow functions handle 'this' differently, this needs to be a regular function
PostSchema.pre('save', function(next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

module.exports = mongoose.model('Post', PostSchema)
