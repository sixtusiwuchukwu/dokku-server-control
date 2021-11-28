import {permitted,requiresAuth} from "../../helper/permissions";
import {IAddServerInterface,AddServerMemberInterface ,changeServerOwnershipInterface,importServerToGroupInterface} from "../../interfaces/DataSources/server";

const MESSAGE_SENT : string= "MESSAGE_SENT";

const ServerQuery = {
  // @ts-ignore
  listServers:  permitted.createResolver(async (root:any, data:any , { dataSources }:{dataSources: { ServerControl:any }}) => {
    const { ServerControl } = dataSources;
    return await new ServerControl().listServers(data);
  }),

  // @ts-ignore
  listUserServers:  requiresAuth.createResolver(async (root:any, data:any , { dataSources,req }:{dataSources: { ServerControl:any }}) => {
    const { ServerControl } = dataSources;
    return await new ServerControl().listUserServers(data,req.user);
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
  addServerMember: permitted.createResolver(async (root:any, { data }:{data:AddServerMemberInterface}, { dataSources, req }:{dataSources:{ServerControl:any}}) => {
    const { ServerControl } = dataSources;

    return await new ServerControl("d").addServerMember(data, req.user);
  }),
  // @ts-ignore
  changeServerOwnership: permitted.createResolver(async (root:any, { data }:{data:changeServerOwnershipInterface}, { dataSources, req }:{dataSources:{ServerControl:any}}) => {
    const { ServerControl } = dataSources;

    return await new ServerControl("d").changeServerOwnership(data,req.user);
  }),
  // @ts-ignore
  importServerToGroup: requiresAuth.createResolver(async (root:any, { data }:{data:importServerToGroupInterface}, { dataSources, req }:{dataSources:{ServerControl:any}}) => {
    const { ServerControl } = dataSources;

    return await new ServerControl("d").importServerToGroup(data,req.user);
  }),
  // @ts-ignore
  deleteServer: permitted.createResolver(async (root:any,  data :{data:importServerToGroupInterface}, { dataSources, req }:{dataSources:{ServerControl:any}}) => {
    const { ServerControl } = dataSources;

    return await new ServerControl("d").deleteServer(data,req.user);
  }),
  // @ts-ignore
  removeServerMember: permitted.createResolver(async (root:any,  data :{data:removeServerMemberInterface}, { dataSources, req }:{dataSources:{ServerControl:any}}) => {
    const { ServerControl } = dataSources;

    return await new ServerControl("d").removeServerMember(data,req.user);
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
