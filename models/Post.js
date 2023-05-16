const { model, Schema } = require('mongoose');

const PostSchema = new Schema({
    body: String,
    userId: String,
    createdAt: String,
    likes: [String],
    likesCount: Number,
    comments: [String],
    commentsCount: Number,
});

module.exports = model('Post', PostSchema);