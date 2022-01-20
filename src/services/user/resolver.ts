import {PubSub} from "apollo-server-express";
import {Request, Response} from "express";
import {cookieOptions} from "../../tools/config";
import { requiresAuth, serverPermit} from "../../helper/permissions"
import Base from "../../../base"
import UserDatasource from "./datasource";
import datasource from "../../datasource";
import loggedInInterface from "../../interfaces/AuthInterface";
import {ObjectId} from "mongoose";
const Log = new Base().Log
const pubsub = new PubSub();

const NEW_USER = "NEWUSER";
const UserMutation = {
  addUser: async (root: any, {data}: { data: any }, {dataSources}: { dataSources: typeof datasource, req: Request, res: Response }) => {
    const User: typeof UserDatasource = (dataSources as typeof dataSources).User;
    return await new User().addUser(data);
  },

  loginUser:async (parent: any, data: any, {dataSources,req,res}: { dataSources: typeof datasource, req: Request, res: Response }, info: any)=> {
    const User = dataSources.User as typeof UserDatasource;
    let payLoad = {serviceName: info.fieldName, user:(req as any).user?._id,ip:req.headers['user-agent']}
    await Log(payLoad)
    const [accessToken, refreshAccessToken] = await new User().loginUser(data)
    res.cookie('x-token', accessToken, cookieOptions)
    res.cookie('x-refresh-token', refreshAccessToken, cookieOptions)
    return 'login completed'
  },
  forgotPassword:async (parent: any, data: any, {dataSources,req,res}: { dataSources: typeof datasource, req: Request, res: Response }, info: any)=> {
    const User = (dataSources.User as typeof UserDatasource);
    const userId:any = await new User().forgotPassword(data.email, req.headers.origin)
    let payLoad = {serviceName: info.fieldName, user:userId,ip:req.headers['user-agent']}
    await Log(payLoad)
    return 'Request completed'
  },
  resetPassword:async (parent: any, data: any, {dataSources,req,res}: { dataSources: typeof datasource, req: Request, res: Response }, info: any)=> {
    const User = dataSources.User as typeof UserDatasource;
    const [accessToken, refreshAccessToken, userId]: Array<string | ObjectId> = await new User().resetPassword(data, req.headers.origin)
    res.cookie('x-token', accessToken, cookieOptions)
    res.cookie('x-refresh-token', refreshAccessToken, cookieOptions)
    let payLoad = {serviceName: info.fieldName, user: userId as ObjectId,ip:req.headers['user-agent']}
    await Log(payLoad)
    return 'login and password update completed'
  },
  updatePerson: (requiresAuth as any).createResolver(async (root: any, {data}: { data: any }, { dataSources, req}: { dataSources: typeof datasource, req: Request }) => {
    const User = dataSources.User as typeof UserDatasource;
    const user = (req as any).user as loggedInInterface
    return await new User().updatePerson(data,user)
  }),

  updatePassword: serverPermit.createResolver(async (root: any, data: { oldPassword: string, newPassword: string }, {dataSources,req}: { dataSources: typeof datasource, req: Request }) => {
    const User = dataSources.User as typeof UserDatasource;
    const user = (req as any).user as loggedInInterface
    return await new User().updatePassword(data,user)
  }),
  logout: (requiresAuth as any).createResolver(async (root: any, data: { oldPassword: string, newPassword: string }, {res}: {  res: Response }) => {
    res.clearCookie('x-token', cookieOptions)
    res.clearCookie('x-refresh-token', cookieOptions)
    return "logout successful";
  }),

}
const UserQuery = {
  getCurrentUser: (requiresAuth as any).createResolver(async (root: any, {data}: { data: any }, { dataSources,req }: { dataSources: typeof datasource, req: Request }) => {
    const User = dataSources.User as typeof UserDatasource;
    const user = (req as any).user as loggedInInterface
    return await new User().getCurrentUser(user)
  })
};

const UserSubscription = {
  newUser: {
    subscribe: async (root:any, args:any, context:any) => {
      return  pubsub.asyncIterator(NEW_USER);
    },
  },
};

export { UserMutation,UserQuery, UserSubscription };
