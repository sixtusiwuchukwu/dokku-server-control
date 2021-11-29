import {serverPermit,requiresAuth} from "../../helper/permissions";
import {IAddServerInterface,AddServerMemberInterface ,changeServerOwnershipInterface,importServerToGroupInterface} from "../../interfaces/DataSources/server";

const MESSAGE_SENT : string= "MESSAGE_SENT";

const ServerQuery = {
  // @ts-ignore
  listServers:  serverPermit.createResolver(async (root:any, data:any , { dataSources }:{dataSources: { ServerControl:any }}) => {
    const { ServerControl } = dataSources;
    return await new ServerControl().listServers(data);
  }),

  // @ts-ignore
  listUserServers:  requiresAuth.createResolver(async (root:any, data:any , { dataSources,req }:{dataSources: { ServerControl:any }}) => {
    const { ServerControl } = dataSources;
    return await new ServerControl().listUserServers(req.user);
  }),
  // @ts-ignore
  listServerMembers:  requiresAuth.createResolver(async (root:any, {data}:any , { dataSources,req }:{dataSources: { ServerControl:any }}) => {
    const { ServerControl } = dataSources;
    return await new ServerControl().listServerMembers(data,req.user);
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
  addServerMember: serverPermit.createResolver(async (root:any, { data }:{data:AddServerMemberInterface}, { dataSources, req }:{dataSources:{ServerControl:any}}) => {
    const { ServerControl } = dataSources;

    return await new ServerControl("d").addServerMember(data, req.user);
  }),
  // @ts-ignore
  changeServerOwnership: serverPermit.createResolver(async (root:any, { data }:{data:changeServerOwnershipInterface}, { dataSources, req }:{dataSources:{ServerControl:any}}) => {
    const { ServerControl } = dataSources;

    return await new ServerControl("d").changeServerOwnership(data);
  }),
  // @ts-ignore
  importServerToGroup: serverPermit.createResolver(async (root:any, { data }:{data:importServerToGroupInterface}, { dataSources, req }:{dataSources:{ServerControl:any}}) => {
    const { ServerControl } = dataSources;

    return await new ServerControl("d").importServerToGroup(data,req.user);
  }),
  // @ts-ignore
  deleteServer: serverPermit.createResolver(async (root:any, { data }:{data:importServerToGroupInterface}, { dataSources, req }:{dataSources:{ServerControl:any}}) => {
    const { ServerControl } = dataSources;

    return await new ServerControl("d").deleteServer(data,req.user);
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
