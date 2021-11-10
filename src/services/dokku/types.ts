import {gql} from "apollo-server-express";

const dokkuGql = gql`
  extend type Mutation {
      createDokkuApp(serverId:ID! appName:String!):String
      startDokkuApp(serverId: ID! appName: String!):String
      stopDokkuApp(serverId: ID! appName: String!):String
      StopAllDokkuApp(serverId: ID!):String
      restartPolicy(serverId: ID! policy: String! appName: String!):String
      DokkuAppReport(serverId:ID! appName:String! select:String!):String
  }
  
`

export default dokkuGql
