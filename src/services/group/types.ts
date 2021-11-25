const {gql} = require("apollo-server-express");

const PostTypes = gql`
    extend type Mutation {
        addGroup(data: groupInput): String!
        addGroupMember(data:addGroupMemberInput):String!
        changeGroupOwnership(data:newOwnerInput):String!
        deleteGroup(data:deleteGroupInput):String!
        deleteGroupServer(data:deleteGroupInput):String!
    }
    extend type Query {
        listGroups(page: Int! search: String): groupListPagination
        listUserGroups:[servers]!
        listGroupMembers(data:listServerMembersInput):[groupMembers]
    }

    
    type groups {
        _id: ID!
        groupName:String
        servers: [servers]!
        members:[members]
        createdAt: DateTime!
        updatedAt: DateTime!
    }
    type groupListPagination {
        docs: [servers]
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
        serverId:ID
    }

`;

export default PostTypes;
