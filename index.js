require('dotenv').config()
const http = require("http");
const express = require("express");
const { ApolloServer, PubSub } = require("apollo-server-express");
const db = require( './src/db/index' );
const { typeDefs, resolvers } = require("./src/schema");
const formatError = require('./src/helper/formatError')
const datasources = require("./src/datasource");

const fs = require("fs");

const path = require("path");

const {MONGO_URL,DOKKU_MONGO_AQUA_URL} = require("./src/tools/config");
new db( console ).connect( MONGO_URL || DOKKU_MONGO_AQUA_URL );

// initialize app
const app = express();
const homedir = require('os').homedir();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type,Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT,POST,GET,DELETE,PATCH,UPDATE"
    );
    return res.status(200).json({});
  }
  next();
});

// connect to database




const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: formatError(console),
  subscriptions: {
    onConnect: () => console.log("websocket connected"),
    onDisconnect: () => console.log("websocket disconnected"),
  },
  context: ({ req, res }) => ({
    req,
    res,
    pubsub,
    datasources,
    engine: {
      reportSchema: true,
    },
  }),
  introspection: true,
  tracing: true,
  playground: true,
});
// setting middleware

server.applyMiddleware({ app, path: "/" });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// initialize server port
const PORT = process.env.PORT || 2000;

httpServer.listen(PORT, () =>
  console.log(`🚀 Server is ready at port ${PORT}`)
);

console.log(
  `subscription is ready at localhost:${PORT}${server.subscriptionsPath}`
);