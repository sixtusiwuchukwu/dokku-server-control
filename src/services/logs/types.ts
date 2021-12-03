const {gql} = require("apollo-server-express");

const LogsType = gql`
    extend type Query {
        getLogs(page: Int! search: String):[Logs]
        getUserLogs:[Logs]
    }

    #extend type Mutation {
    #    
    #}
    type Logs {
        _id:ID!
        serviceName:String!
        user:ID
        ip:String
        createdAt:DateTime!
        updateAt:DateTime
    }
`

export default LogsType