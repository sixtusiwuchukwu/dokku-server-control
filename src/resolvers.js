const {
  UserMutaion,
  UserSubscription,
} = require("../src/services/user/resolver");

const {
  PostMutaion,
  PostQuery,
  PostSubscription,
} = require("../src/services/post/resolver");

const Mutation = {
  ...UserMutaion,
  ...PostMutaion,
};
const Query = {
  ...PostQuery,
};
const Subscription = {
  ...UserSubscription,
  ...PostSubscription,
};

module.exports = {
  Mutation,
  Query,
  Subscription,
};
