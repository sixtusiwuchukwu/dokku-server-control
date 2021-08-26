const { gql } = require("apollo-server-express");

const PostTypes = gql`
  extend type Mutation {
    addPost(data: postInput): Post
  }

  extend type Query {
    getPost: [Post]
  }

  type Post {
    _id: ID
    username: String!
    message: String!
  }
  input postInput {
    username: String!
    message: String!
  }

  extend type Subscription {
    newPost: Post
  }
`;

module.exports = PostTypes;
