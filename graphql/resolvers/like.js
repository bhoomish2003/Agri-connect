const { UserInputError } = require("apollo-server-errors");

const Like = require("../../models/Like.js");
const Post = require("../../models/Post.js");
const User = require("../../models/User.js");
const { HeaderAuth } = require("../../services/auth.js");

module.exports = {
    Like: {
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
        addLike: async function(parent, { postId }, context) {
            const user = HeaderAuth(context);

            const newLike = new Like({
                postId,
                userId: user.id,
            })

            const res = await newLike.save();

            await Post.updateOne({ _id: postId }, {
                $inc: { likesCount: 1 }
            });

            return {
                id: res._id,
                ...res._doc
            }
        },
        removeLike: async function(parent, { postId }, context) {
            const user = HeaderAuth(context);

            const [like] = await Like.find({ postId, userId: user.id });

            if(!like) {
                throw new UserInputError('like removed already');
            }

            await like.remove();

            await Post.updateOne({ _id: postId }, {
                $inc: { likesCount: -1 }
            });

            return 'like removed';
        }
    }
}