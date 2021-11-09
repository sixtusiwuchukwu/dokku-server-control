import {permitted, requiresAuth} from "../../helper/permissions";
import {IAddServerInterface} from "../../interfaces/DataSources/server";

const MESSAGE_SENT : string= "MESSAGE_SENT";

const ServerQuery = {
  // @ts-ignore
  listServers:  permitted.createResolver(async (root:any, data:any , { dataSources }:{dataSources: { ServerControl:any }}) => {
    const { ServerControl } = dataSources;
    return await new ServerControl().listServers(data);
  }),
};

// @ts-ignore

const ServerMutations = {
// @ts-ignore
  addServer: permitted.createResolver(async (root:any, { data }:{data:IAddServerInterface}, { dataSources, req }:{dataSources:{ServerControl:any}}) => {
    const { ServerControl } = dataSources;

    return await new ServerControl("d").addServer(data, req.user);
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
