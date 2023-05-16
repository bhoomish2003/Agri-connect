const { Schema, default: mongoose } = require('mongoose');

const UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String,
})

module.exports = mongoose.model('User', UserSchema);