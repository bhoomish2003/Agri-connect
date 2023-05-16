const register = require('./register.js');
const post = require('./post.js');
const comment = require('./comment.js');
const like = require('./like.js');

module.exports = {
    Query: {
        test: ()=>'Test',
        ...post.Query,
    },
    Mutation: {
        ...register.Mutation,
        ...post.Mutation,
        ...comment.Mutation,
        ...like.Mutation
    },
    Post: post.Post,
    Comment: comment.Comment,
    Like: like.Like
};