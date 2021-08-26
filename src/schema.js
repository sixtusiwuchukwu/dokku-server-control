const { Query, Mutation, Subscription } = require("./resolvers");
const typeDefs = require("./types");

const resolvers = {
  Subscription,
  Query,
  Mutation,
};

module.exports = {
  typeDefs,
  resolvers,
};
