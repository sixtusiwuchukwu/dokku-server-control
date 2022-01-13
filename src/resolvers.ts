import {
  UserMutation,
  UserSubscription,
  UserQuery
} from "./services/user/resolver";

import {
  ServerQuery,
  ServerMutations,
  ServerSubscription,
} from "./services/servers/resolver";
import {
  GroupQuery,
  GroupMutation,
} from "./services/group/resolver";

import {
  DokkuAppMutations
} from "./services/dokku/resolver";
const removeFromList = ["loginUser", 'addUser']

const Mutation = {
  ...UserMutation,
  ...ServerMutations,
  ...DokkuAppMutations,
  ...GroupMutation
};
const Query = {
  ...ServerQuery,
  ...GroupQuery,
  ...UserQuery
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
