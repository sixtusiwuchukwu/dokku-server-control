import {requiresAuth} from "../../helper/permissions";
import {IServers} from "../../interfaces/datebaseInterface/mongo";
import {IAddServerInterface} from "../../interfaces/DataSources/server";

const MESSAGE_SENT : string= "MESSAGE_SENT";

const ServerQuery = {
  // @ts-ignore
  listServers:  requiresAuth.createResolver(async (root:any, data:any , { dataSources }:{dataSources: { ServerControl:any }}) => {
    const { ServerControl } = dataSources;
    return await new ServerControl("h").listServers(data);
  }),
};

// @ts-ignore

const ServerMutations = {
// @ts-ignore
  addServer: requiresAuth.createResolver(async (root:any, { data }:{data:IAddServerInterface}, { dataSources, req }:{dataSources:{ServerControl:any}}) => {
    const { ServerControl } = dataSources;

    return await new ServerControl("d").addServer(data, req.user);
  }),
  // @ts-ignore
  stopServer: requiresAuth.createResolver(async (root:any,  data:any , { dataSources }:{dataSources: any}) => {
    const { ServerControl } = dataSources;
    return await new ServerControl("d").stopServer(data);
  }),
};

const ServerSubscription = {
  newPost: {
    subscribe: async (root:any, args:any, { pubsub }:{pubsub:any}) => {
      return pubsub.asyncIterator(MESSAGE_SENT);
    },
  },
};

export { ServerQuery, ServerMutations, ServerSubscription };
