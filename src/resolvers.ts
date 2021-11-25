import {
  UserMutation,
  UserSubscription,
} from "./services/user/resolver";

import {
  ServerQuery,
  ServerMutations,
  ServerSubscription,
} from "./services/servers/resolver";

import {
  DokkuAppMutations
} from "./services/dokku/resolver";
const removeFromList = ["loginUser", 'addUser']

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
const AllList:object = {...Query, ...Mutation}
const FilteredList = Object.keys(AllList).filter(res => !removeFromList.includes(res))
// console.log(FilteredList)
export {
  Mutation,
  Query,
  Subscription,
  FilteredList
};
