import {serverPermit, requiresAuth, requiresAdmin} from "../../helper/permissions";
import {IAddServerInterface,AddServerMemberInterface ,changeServerOwnershipInterface,importServerToGroupInterface} from "../../interfaces/DataSources/server";
import datasource from "../../datasource";
import {Request, Response} from "express";
import serverControl from "./datasource";
import loggedInInterface from "../../interfaces/AuthInterface";

const MESSAGE_SENT : string= "MESSAGE_SENT";

const ServerQuery = {
  listServers:  requiresAdmin.createResolver(async (root:any, data:any , { dataSources }:{ dataSources: typeof datasource, req: Request, res: Response }) => {
    const ServerControl  = dataSources.ServerControl as typeof serverControl;
    return await new ServerControl().listServers(data);
  }),

  listUserServers:  (requiresAuth as any).createResolver(async (root:any, data:any , { dataSources,req }:{ dataSources: typeof datasource, req: Request, res: Response }) => {
    const _ServerControl  = dataSources.ServerControl as typeof serverControl;
    const user = (req as any).user as loggedInInterface
    return await new _ServerControl().listUserServers(data, user);
  }),
  listServerMembers:  (requiresAuth as any).createResolver(async (root:any, {data}:any , { dataSources }:{ dataSources: typeof datasource, req: Request, res: Response }) => {
    const ServerControl  = dataSources.ServerControl as typeof serverControl;
    // const user = (req as any).user as loggedInInterface
    return await new ServerControl().listServerMembers(data);
  }),
};


const ServerMutations = {
  addServer: (requiresAuth as any).createResolver(async (root:any, { data }:{data:IAddServerInterface}, { dataSources, req }:{ dataSources: typeof datasource, req: Request, res: Response }) => {
    const ServerControl  = dataSources.ServerControl as typeof serverControl;
    const user = (req as any).user as loggedInInterface
    return await new ServerControl().addServer(data, user);
  }),

  addServerMember: serverPermit.createResolver(async (root:any, { data }:{data:AddServerMemberInterface}, { dataSources, req }:{ dataSources: typeof datasource, req: Request, res: Response }) => {
    const ServerControl  = dataSources.ServerControl as typeof serverControl;
    const user = (req as any).user as loggedInInterface
    return await new ServerControl().addServerMember(data, user);
  }),
  changeServerOwnership: serverPermit.createResolver(async (root:any, { data }:{data:changeServerOwnershipInterface}, { dataSources, req }:{ dataSources: typeof datasource, req: Request, res: Response }) => {
    const ServerControl  = dataSources.ServerControl as typeof serverControl;
    const user = (req as any).user as loggedInInterface
    return await new ServerControl().changeServerOwnership(data,user);
  }),
  importServerToGroup: (requiresAuth as any).createResolver(async (root:any, { data }:{data:importServerToGroupInterface}, { dataSources, req }:{ dataSources: typeof datasource, req: Request, res: Response }) => {
    const ServerControl  = dataSources.ServerControl as typeof serverControl;
    const user = (req as any).user as loggedInInterface

    return await new ServerControl().importServerToGroup(data,user);
  }),
  deleteServer: serverPermit.createResolver(async (root:any,  data :{data:importServerToGroupInterface}, { dataSources, req }:{ dataSources: typeof datasource, req: Request, res: Response }) => {
    const ServerControl = dataSources.ServerControl as typeof serverControl;
    const user = (req as any).user as loggedInInterface
    return await new ServerControl().deleteServer(data,user);
  }),
  removeServerMember: serverPermit.createResolver(async (root:any,  data :{data:any}, { dataSources, req }:{ dataSources: typeof datasource, req: Request, res: Response }) => {
    const ServerControl = dataSources.ServerControl as typeof serverControl;
    const user = (req as any).user as loggedInInterface
    return await new ServerControl().removeServerMember(data,user);
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
