const {gql} = require("apollo-server-express");

const PostTypes = gql`
    extend type Mutation {
        addGroup(data: groupInput): String!
        addGroupMember(data:addGroupMemberInput):String!
        addGroupServer(data:addGroupServerInput):String
        changeGroupOwnership(data:newOwnerInput):String!
        deleteGroup(data:deleteGroupInput):String!
        deleteGroupServer(data:deleteGroupInput):String!
        removeGroupMember(data:removeGroupMemberInput):String!
    }
    extend type Query {
        listGroups(page: Int! search: String): groupListPagination
        listUserGroups:[groups]!
        listGroupMembers(data:listGroupMembersInput):[groupMembers]
    }

    
    type groups {
        _id: ID!
        groupName:String
        createdAt: DateTime!
        updatedAt: DateTime!
    }
    type groupListPagination {
        docs: [groups]
        totalDocs: Int
        hasPrevPage: Boolean
        hasNextPage: Boolean
        page: Int
        limit: Int
        totalPages: Int
        pagingCounter: Int
    }

    type groupMembers {
        permission:[String]
        email:String
    }

    input groupInput {
        groupName: String!
    }
    input addGroupMemberInput {
        groupId:ID
        email:String!
        permission:[String]!
    }
    
    input deleteGroupInput {
        serverId:ID
    }
    input listGroupMembersInput{
        groupId:ID
    }
    input addGroupServerInput{
        groupId:ID
        username: String!
        host: String!
        serverName: String!
        pkey: String!
        port: Int!
    }
    
    input removeGroupMemberInput {
        groupId:ID!
        memberEmail:ID!
    }

`;

export default PostTypes;
