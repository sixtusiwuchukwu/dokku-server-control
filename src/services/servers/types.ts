const {gql} = require("apollo-server-express");

const PostTypes = gql`
    extend type Mutation {
        addServer(data: serverInput): String!
        addServerMember(data:addMemberInput):String!
        changeServerOwnership(data:newOwnerInput):String!
        importServerToGroup(data:importServerToGroupInput):String!
        deleteServer(data:deleteServerInput):String!
    }
    extend type Query {
        listServers(page: Int! search: String): serverListPagination
        listUserServers:[servers]!
        listServerMembers(data:listServerMembersInput):[members]
    }
  
    extend type Subscription {
        newPost: [String]
    }
    
    type servers {
        _id: ID!
        host: String!
        serverName: String!
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
    
    type members {
        permission:[String]
        email:String
    }

    input serverInput {
        username: String!
        host: String!
        serverName: String!
        pkey: String!
        port: Int!
    }
    input addMemberInput {
        serverId:ID
        email:String!
        permission:[String]!
    }
    input newOwnerInput {
        serverId:ID
        email:String
    }
    input importServerToGroupInput {
        serverId:ID
        groupId:ID
    }
    
    input deleteServerInput {
        serverId:ID
    }
    input listServerMembersInput{
        serverId:ID
    }
 
`;

export default PostTypes;
