const { Schema, model } = require('mongoose');

const LikeSchema = new Schema({
    id: String,
    postId: String,
    userId: String,
})

module.exports = model('Like', LikeSchema);