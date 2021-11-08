import {
  UserMutation,
  UserSubscription,
} from "./services/user/resolver";

import {
  ServerQuery,
  ServerMutations,
  ServerSubscription,
} from "./services/Servers/resolver";

import {
  DokkuAppMutations
} from "./services/dokku/resolver";

const Mutation = {
  ...UserMutation,
  ...ServerMutations,
  ...DokkuAppMutations
};
const Query = {
  ...ServerQuery,
};
const Subscription = {
  ...UserSubscription,
  ...ServerSubscription,
};

export {
  Mutation,
  Query,
  Subscription,
};
