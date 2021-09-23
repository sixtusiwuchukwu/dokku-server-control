import {
  UserMutation,
  UserSubscription,
} from "./services/user/resolver";

import {
  ServerQuery,
  ServerMutations,
  ServerSubscription,
} from "./services/Servers/resolver";

const Mutation = {
  ...UserMutation,
  ...ServerMutations,
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
