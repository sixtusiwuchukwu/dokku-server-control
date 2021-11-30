import { gql }from"apollo-server-express";
import UserSchema from "./services/user/types";
import ServerSchema from "./services/servers/types";
import GroupSchema from "./services/group/types";
import dokkuGql from "./services/dokku/types";

// Types bootstrapper
const linkSchemas = gql`
    scalar DateTime
    scalar JSON
    enum accountType {
        admin,
        user
    }
  type Mutation {
    _: Boolean
  }

  type Query {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [linkSchemas, UserSchema, ServerSchema,dokkuGql,GroupSchema];
