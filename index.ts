require('dotenv').config()
import * as http from "http";
// @ts-ignore
import express, {Request, Response,NextFunction, Application} from 'express'
import { ApolloServer, PubSub } from "apollo-server-express";
import  db  from './src/db' ;
import { typeDefs, resolvers } from "./src/schema";
import formatError from './src/helper/formatError';
import dataSources from "./src/datasource";


const {MONGO_URL,DOKKU_MONGO_AQUA_URL} = require("./src/tools/config");
new db( console, null ).connect( MONGO_URL || DOKKU_MONGO_AQUA_URL );

const { readFileSync } = require('fs');

const { Client } = require('ssh2');


// initialize app
const app:Application = express();
const homedir = require('os').homedir();
// const conn = new Client();
// conn.on('ready', () => {
//   console.log('Client :: ready');
//   conn.shell((err, stream) => {
//     if (err) throw err;
//     stream.on('close', () => {
//       console.log('Stream :: close');
//       conn.end();
//     }).on('data', (data) => {
//       console.log(data.toString('utf8'));
//     });
//     setTimeout(()=>{
//       stream.write('\nls -a \n');
//     },2000)
//
//     // stream.write('ls -a');
//     // stream.write('ls -a');
//
//   });
// }).connect({
//   host: 'ec2-54-211-206-26.compute-1.amazonaws.com',
//   port: 22,
//   username: 'ubuntu',
//   privateKey: readFileSync(path.join('deeptech.pem'))
//   // privateKey: readFileSync(path.join(homedir, '.ssh','id_rsa'))
// });

// setTimeout(()=>{
//   conn.exec('ls -a',{}, (e,j)=>{
//     console.log(e,j)
//   })
//   // stream.end('ls -a');
// },10000)
app.use((req:Request, res:Response, next: NextFunction) => {
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
    datasources:dataSources,
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
