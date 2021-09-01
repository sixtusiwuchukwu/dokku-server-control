const { Query, Mutation, Subscription } = require("./resolvers");
const { GraphQLDateTime } = require( 'graphql-iso-date' );
const GraphQLJSON = require( 'graphql-type-json' );
const typeDefs = require("./types");

const resolvers = {
  Subscription,
  Query,
  Mutation,
  JSON : GraphQLJSON ,
  DateTime : GraphQLDateTime ,
};

module.exports = {
  typeDefs,
  resolvers,
};
