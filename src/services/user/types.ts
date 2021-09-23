import {gql} from "apollo-server-express";

const UserTypes = gql`
  extend type Mutation {
    joingroup(data: userInput): User
  }

  type User {
    _id: ID
    username: String!
  }

  input userInput {
    username: String!
  }

  extend type Subscription {
    newUser: User
  }
`;

export default  UserTypes;
