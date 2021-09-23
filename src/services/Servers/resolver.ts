const MESSAGE_SENT = "MESSAGE_SENT";

const ServerQuery = {
  listServers: async (root:any, data:any , { datasources }:{datasources: { Server:any }}) => {
    const { Server } = datasources;
    return await new Server("h").listServers(data);
  },
};

const ServerMutations = {
  addServer: async (root:any, { data }:{data:object}, { datasources }:{datasources:{Server:any}}) => {
    const { Server } = datasources;
    return await new Server("nh").addServer(data);
  },
  stopServer: async (root:any,  data:any , { datasources }:{datasources: any}) => {
    const { Server } = datasources;
    return await new Server("h").stopServer(data);
  },
};

const ServerSubscription = {
  newPost: {
    subscribe: async (root:any, args:any, { pubsub }:{pubsub:any}) => {
      return await pubsub.asyncIterator(MESSAGE_SENT);
    },
  },
};

export { ServerQuery, ServerMutations, ServerSubscription };
