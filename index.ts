
import cors from "./src/tools/cors";

import * as http from "http";
// @ts-ignore
import express, {Request, Response,NextFunction, Application} from 'express'
import { ApolloServer, PubSub } from "apollo-server-express";
import  db  from './src/db' ;

import { typeDefs, resolvers } from "./src/schema";
import formatError from './src/helper/formatError';
import dataSources from "./src/datasource";
import cookieParser from 'cookie-parser'

import {MONGO_URL, DOKKU_MONGO_AQUA_URL, isDev} from "./src/tools/config";
import includeUser from "./src/helper/IncludeUser";
import {log} from "util";
const devOrigins:Array<string> = ["http://localhost:4000"]
const Origins:Array<string> = [""]
if(isDev) {
  Origins.push(...devOrigins)
}
new db( console ).connect( MONGO_URL || DOKKU_MONGO_AQUA_URL );



// initialize app
const app:Application = express();

app.use(cookieParser())
app.use(cors(Origins));
app.use(includeUser);


// connect to database




const pubsub:any = new PubSub();


const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError,
  subscriptions: {
    onConnect: ():any => console.log("websocket connected"),
    onDisconnect: ():any => console.log("websocket disconnected"),
  },
  context: ({ req, res }) => ({
    req,
    res,
    pubsub,
    dataSources:dataSources,
    engine: {
      reportSchema: true,
    },
  }),
  introspection: isDev,
  tracing: isDev,
});
// setting middleware

server.applyMiddleware({ app, path: "/", cors : false  });

const httpServer: any = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// initialize server port
const PORT = process.env.PORT || 2000;

httpServer.listen(PORT, ():void =>
  console.log(`🚀 Server is ready at port http://localhost:${PORT}`)
);

console.log(
  `subscription is ready at localhost:${PORT}${server.subscriptionsPath}`
);
