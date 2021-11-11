import {gql} from "apollo-server-express";

const dokkuGql = gql`
  extend type Mutation {
      createDokkuApp(serverId:ID! appName:String!):String
      startDokkuApp(serverId: ID! appName: String!):String
      stopDokkuApp(serverId: ID! appName: String!):String
      stopAllDokkuApp(serverId: ID!):String
      reStartPolicy(serverId: ID! policy: String! appName: String!):String
      dokkuAppReport(serverId:ID! appName:String! select:String!):String
      reBuildDokkuApp(serverId:ID! appName:String!):String
      reStartDokkuApp(serverId:ID! appName:String!):String
  }
  
`

export default dokkuGql
