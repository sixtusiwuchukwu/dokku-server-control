const { gql } = require("apollo-server-express");

const PostTypes = gql`
  extend type Mutation {
    addServer(data: serverInput): String!
    stopServer(_id: ID!): String!
  }

  extend type Query {
    listServers(page: Int! search: String): serverListPagination
  }
  type servers {
      _id: ID!
      host: String!
      ServerName: String!
      createdAt: DateTime!
      updatedAt: DateTime!
  }
  type serverListPagination {
      docs: [servers]
      totalDocs: Int
      hasPrevPage: Boolean
      hasNextPage: Boolean
      page: Int
      limit: Int
      totalPages: Int
      pagingCounter: Int
  }

  input serverInput {
      username: String!
      host: String!
      ServerName: String!
      pkey: String!
      port: Int!
  }

  extend type Subscription {
    newPost: [String]
  }
`;

module.exports = PostTypes;
