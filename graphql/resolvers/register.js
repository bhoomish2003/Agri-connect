const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User.js');
const { SECRET_KEY } = require('../../keys.js');

module.exports = {
    Mutation: {
        register: async function(parent , { input }) {
            console.log('user registered');

            const userAlreadyExist = await User.find( { username: input.username } );

            if(userAlreadyExist.length != 0) {
                throw new UserInputError('username already exist');
            }
            
            const hashPassword = await bcrypt.hash(input.password, 12);
            const token = jwt.sign(
                {
                    id: input.username,
                    username: input.username,
                    email: input.email,
                },
                SECRET_KEY,
                { expiresIn: '1h' }
            );

            const newUser = new User({
                username: input.username,
                password: hashPassword, 
                email: input.email,
                createdAt: new Date().toISOString(),
            })

            const res = await newUser.save();

            return {
                id: res._id,
                ...res._doc,
                token
            };
        },

        login: async function(parent, { username, password }) {
            const existUser = await User.find({ username });

            if(existUser.length == 0){
                throw new UserInputError('incorrect username');
            }

            const passwordMatch = await bcrypt.compare(password, existUser[0].password);
            if(!passwordMatch) {
                throw new UserInputError('password incorrect');
            }
            
            const token = jwt.sign({
                id: existUser[0].id,
                username: existUser[0].username,
                email: existUser[0].email,
            }, 
            SECRET_KEY,
            { expiresIn: '1h' }
            );

            return {
                id: existUser[0]._id,
                ...existUser[0]._doc,
                token
            };
        }
    }
}