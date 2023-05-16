const { gql } = require('apollo-server');

const typeDefs = gql`

    type Comment {
        id: ID!
        body: String!
        postId: ID!
        post: Post!
        userId: ID!
        user: User!
        createdAt: String!
    }

    type Like {
        id: ID!
        postId: ID!
        post: Post!
        userId: ID!
        user: User!
    }

    type Post {
        id: ID!
        body: String!
        createdAt: String!
        userId: ID!
        user: User!
        likes: [Like]!
        likesCount: Int!
        comments: [Comment]!
        commentsCount: Int!
    }

    type User {
        id: ID!
        username: String!
        email: String!
        token: String!
        createdAt: String!
    }

    input registerUserInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    
    type Query {
        allUsers: [User]!
        currUser: User
        test: String!
        allPosts: [Post]!
        post(id: ID!): Post!
    }

    type Mutation {
        register(input: registerUserInput!): User!
        login(username: String!, password: String!): User!
        addPost(body: String!): Post!
        editPost(postId: ID!, body: String!): Post!
        deletePost(postId: ID!): String!
        addComment(postId: ID!, body: String!): Comment!
        addLike(postId: ID!): Like!
        removeLike(postId: ID!): String!
    }
     
`;

module.exports = typeDefs; 