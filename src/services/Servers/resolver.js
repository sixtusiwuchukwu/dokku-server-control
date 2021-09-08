const MESSAGE_SENT = "MESSAGE_SENT";

const ServerQuery = {
  listServers: async (root, data , { datasources }) => {
    const { Server } = datasources;
    return await new Server().listServers(data);
  },
};

const ServerMutations = {
  addServer: async (root, { data }, { datasources, pubsub }) => {
    const { Server } = datasources;
    return await new Server().addServer(data);
  },
  stopServer: async (root,  data , { datasources, pubsub }) => {
    const { Server } = datasources;
    return await new Server().stopServer(data);
  },
};

const ServerSubscription = {
  newPost: {
    subscribe: async (root, args, { pubsub }) => {
      return await pubsub.asyncIterator(MESSAGE_SENT);
    },
  },
};

module.exports = { ServerQuery, ServerMutations, ServerSubscription };
