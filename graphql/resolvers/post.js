const { UserInputError, AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post.js');
const User = require('../../models/User.js');
const Comment = require('../../models/Comment.js');
const Like = require('../../models/Like.js');

const { HeaderAuth } = require('../../services/auth.js');

module.exports = {
  Post: {
    user: async function({ userId }, args) {
      const [user] = await User.find({ _id: userId });

      if (!user) {
        throw new UserInputError('no such user');
      }

      return user;
    },
    comments: async function({ id }, args) {
      const comments = await Comment.find({ postId: id });

      return comments;
    },
    likes: async function({ id }) {
      const likes = await Like.find({ postId: id });
      
      return likes;
    }
  },
  Query: {
    post: async function(parent, { id }) {
      try {
        const post = Post.findOne({ _id: id });
        return post;
      }catch(err) {
        throw new Error(err);
      }
    },
    allPosts: async function(parent, args) {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      }
      catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    addPost: async function(parent, { body }, context) {
      const user = HeaderAuth(context);

      // console.log(user);

      const newPost = new Post({
        body,
        userId: user.id,
        createdAt: new Date().toISOString(),
        likes: [],
        likesCount: 0,
        comments: [],
        commentsCount: 0,
      })
      const res = await newPost.save();

      return {
        id: res._id,
        ...res._doc
      };
    },
    editPost: async function(parent, { body, postId }, context) {
      const user = HeaderAuth(context);

      console.log('editpost')

      const [post] = await Post.find({ _id: postId });

      if(user.id != post.userId) {
        throw new AuthenticationError('this user  not allowed to edit this post');
      }

      const res = await Post.updateOne({ _id: postId } , {
        $set: {
          body: body,
        }
      })

      const [updatedPost] = await Post.find({ _id: postId });
      
      return {
        id: updatedPost._id,
        ...updatedPost._doc,
      };
    },
    deletePost: async function(parent, { postId }, { req }) {
      const user = HeaderAuth({ req });

      const [post] = await Post.find({ _id: postId });

      if(!post) {
        throw new UserInputError('no such post');
      }

      if(post.userId != user.id) {
        throw new AuthenticationError('this user not allowed delete this post');
      }
      
      await post.delete();
      return 'post deleted successfully';
    }
  }
}