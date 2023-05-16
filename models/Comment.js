const { model, Schema } = require('mongoose');

const CommentSchema = new Schema({
    body: String,
    userId: String,
    postId: String,
    createdAt: String,
});

module.exports = model('Comment', CommentSchema);