import {requiresAuth} from "../../helper/permissions";
import DokkuAppControl from "./datasource";

const MESSAGE_SENT : string = "MESSAGE_SENT";

const ServerQuery = {
  // @ts-ignore
  // listServers:  requiresAuth.createResolver(async (root:any, data:any , { dataSources }:{dataSources: { Server:any }}) => {
  //   const { Server } = dataSources;
  //   return await new Server("h").listServers(data);
  // }),
};

// @ts-ignore

const DokkuAppMutations = {
  // @ts-ignore
  startDokkuApp: requiresAuth.createResolver(async (root:any,  data:any , { dataSources }:{dataSources: any}) => {
    const { DokkuAppControl } = dataSources;
    return  await new DokkuAppControl("d").startDokkuApp(data);
  }),
  // @ts-ignore
  stopServer: requiresAuth.createResolver(async (root:any,  data:any , { dataSources }:{dataSources: any}) => {
    const { DokkuAppControl } = dataSources;
    return await new DokkuAppControl("d").stopServer(data);
  }),
};

const ServerSubscription = {
  newPost: {
    subscribe: async (root:any, args:any, { pubsub }:{pubsub:any}) => {
      return pubsub.asyncIterator(MESSAGE_SENT);
    },
  },
};

export { ServerQuery, DokkuAppMutations, ServerSubscription };
