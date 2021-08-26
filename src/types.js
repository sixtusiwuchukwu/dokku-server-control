const { gql } = require("apollo-server-express");
const UserSchema = require("../src/services/user/types");
const PostSchema = require("../src/services/post/types");

// Types bootstrapper
const linkSchemas = gql`
  type Mutation {
    _: Boolean
  }

  type Query {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

module.exports = [linkSchemas, UserSchema, PostSchema];
