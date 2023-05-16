const { UserInputError } = require('apollo-server');

const { HeaderAuth } = require('../../services/auth.js');
const Comment = require('../../models/Comment.js');
const Post = require('../../models/Post.js');
const User = require('../../models/User.js');


module.exports = {
  Comment: {
    user: async function({ userId }, args) {
      const [user] = await User.find({ _id: userId });

      if(!user){
        throw new UserInputError('no such user');
      }
      return user;
    },
    post: async  function({ postId }, args) {
      const [post] = await Post.find({ _id: postId });

      if(!post){
        throw new UserInputError('no such post');
      }
      return post;
    }
  },
  Mutation: {
    addComment: async function(parent, { postId, body }, context) {
      const user = HeaderAuth(context);

      const [post] = Post.find({ _id: postId });
      if(!post) {
        throw new UserInputError('no such post');
      }

      const newComment = new Comment({
        postId,
        userId: user.id,
        body,
        createdAt: new Date().toISOString(),
      })

      const res = await newComment.save();

      await Post.updateOne({ _id: postId }, {
        $inc: { commentsCount: 1 }
      })

      return {
        id: res._id,
        ...res._doc
      }
    }
  }
};