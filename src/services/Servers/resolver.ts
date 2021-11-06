import {requiresAuth} from "../../helper/permissions";

const MESSAGE_SENT : string= "MESSAGE_SENT";

const ServerQuery = {
  // @ts-ignore
  listServers:  requiresAuth.createResolver(async (root:any, data:any , { datasources }:{datasources: { Server:any }}) => {
    const { Server } = datasources;
    return await new Server("h").listServers(data);
  }),
};

// @ts-ignore

const ServerMutations = {
// @ts-ignore
  addServer: requiresAuth.createResolver(async (root:any, { data }:{data:object}, { datasources }:{datasources:{Server:any}}) => {
    const { Server } = datasources;
    return await new Server("d").addServer(data);
  }),
  // @ts-ignore
  stopServer: requiresAuth.createResolver(async (root:any,  data:any , { datasources }:{datasources: any}) => {
    const { Server } = datasources;
    return await new Server("d").stopServer(data);
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
