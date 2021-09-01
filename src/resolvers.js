const {
  UserMutaion,
  UserSubscription,
} = require("../src/services/user/resolver");

const {
  ServerQuery,
  ServerMutations,
  ServerSubscription,
} = require("./services/Servers/resolver");

const Mutation = {
  ...UserMutaion,
  ...ServerMutations,
};
const Query = {
  ...ServerQuery,
};
const Subscription = {
  ...UserSubscription,
  ...ServerSubscription,
};

module.exports = {
  Mutation,
  Query,
  Subscription,
};
