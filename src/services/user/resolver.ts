import {PubSub} from "apollo-server-express";
import {cookieOptions} from "../../tools/config";
import { createResolver, requiresAuth, serverPermit} from "../../helper/permissions"
import Base from "../../../base"
const Log = new Base().Log
const pubsub = new PubSub();

const NEW_USER = "NEWUSER";
const UserMutation = {
  addUser: async (root: any, {data}: { data: any }, {dataSources}: { dataSources: { User: any } }) => {
    const {User} = dataSources;
    return await new User().addUser(data);
  },

  loginUser:async (parent: any, data: any, {dataSources,req,res}: any, info: any)=> {
    const {User} = dataSources;
    let payLoad = {serviceName: info.fieldName, user:req.user?._id,ip:req.headers['user-agent']}
    await Log(payLoad)
    const [accessToken, refreshAccessToken] = await new User().loginUser(data)
    res.cookie('x-token', accessToken, cookieOptions)
    res.cookie('x-refresh-token', refreshAccessToken, cookieOptions)
    return 'login completed'
  },

  updatePerson: (requiresAuth as any).createResolver(async (root: any, {data}: { data: any }, {
    dataSources,
    req
  }: { dataSources: any, req: any }) => {
    const {User} = dataSources;
    const {user} = req
    return await new User().updatePerson(data,user)
  }),
  updatePassword: serverPermit.createResolver(async (root: any, data: { data: any }, {
    dataSources,
    req
  }: { dataSources: any, req: any }) => {
    const {User} = dataSources;
    const {user} = req
    return await new User().updatePassword(data,user)
  }),
}
const UserQuery = {
  getCurrentUser: (requiresAuth as any).createResolver(async (root: any, {data}: { data: any }, { dataSources,req }: { dataSources: any, req: any }) => {
    const {User} = dataSources;
    const {user} = req
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
