import {gql} from "apollo-server-express";

const dokkuGql = gql`
  extend type Mutation {
      startDokkuApp(serverId: ID! appName: String!):String
  }
  
`

export default dokkuGql
