import {gql} from "apollo-server-express";

const UserTypes = gql`
  extend type Mutation {
    addUser(data: userInput): String!
    loginUser(accountId: String! password: String!): String!
  }
  extend type Query {
      getCurrentUser: User!
  }
  type User {
      _id: ID!
      username: String!
      email: String!
      firstName: String!
      lastName: String!
      createdAt: DateTime!
      updatedAt: DateTime!
  }

  input userInput {
      username: String!
      password: String!
      email: String!
      phone: String!
      firstName: String!
      lastName: String!
      permissions:[String!]!
      blackListCommands:[String]
      whiteListCommands:[String]
      allowedRoutes:[String!]!
      accountType: accountType!
  }

  extend type Subscription {
    newUser: User
  }
`;

export default  UserTypes;
