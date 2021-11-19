import {gql} from "apollo-server-express";

const UserTypes = gql`
    extend type Mutation {
        addUser(data: userInput): String!
        loginUser(email: String! password: String!): String!
        updatePerson(data:updatePersonInput):String!
    }
    extend type Query {
        getCurrentUser: User!
    }

    extend type Subscription {
        newUser: User
    }
    type User {
        _id: ID!
        username: String!
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

    input userInput {
        password: String!
        email: String!
    }
    
    input updatePersonInput{
        _id: ID
        username: String
        email: String
        phone: String
        firstName: String
        lastName: String
        permissions:[String!]
        blackListCommands:[String]
        whiteListCommands:[String]
        allowedRoutes:[String!]
        accountType: accountType
    }

`;

export default UserTypes;
