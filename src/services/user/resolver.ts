import {PubSub} from "apollo-server-express";
import {Request, Response} from "express";
import {cookieOptions} from "../../tools/config";
import {createResolver, requiresAuth, serverPermit} from "../../helper/permissions"
import Base from "../../../base"
const Log = new Base().Log
const pubsub = new PubSub();

const NEW_USER = "NEWUSER";
const UserMutation = {
  addUser: async (root: any, {data}: { data: any }, {dataSources}: { dataSources: { User: any } }) => {
    const {User} = dataSources;
    return await new User("s").addUser(data);
  },

  loginUser:createResolver(async (parent: any, data: any, {dataSources,req,res}: any, info: any)=> {
    const {User} = dataSources;
    let payLoad = {serviceName: info.fieldName, user:req.user?._id,ip:req.headers['user-agent']}
    await Log(payLoad)
    const [accessToken, refreshAccessToken] = await new User("s").loginUser(data)
    res.cookie('x-token', accessToken, cookieOptions)
    res.cookie('x-refresh-token', refreshAccessToken, cookieOptions)
    //@ts-ignore
    return 'login completed'
  }),
  // @ts-ignore
  updatePerson: requiresAuth.createResolver(async (root: any, {data}: { data: any }, {
    dataSources,
    req
  }: { dataSources: any, req: any }) => {
    const {User} = dataSources;
    const {user} = req

    return await new User().updatePerson(data,user)


  }),
  // @ts-ignore
  updatePassword: serverPermit.createResolver(async (root: any, data: { data: any }, {
    dataSources,
    req
  }: { dataSources: any, req: any }) => {
    const {User} = dataSources;
    const {user} = req

    return await new User("s").updatePassword(data,user)


  }),
}
const UserQuery = {
  getCurrentUser: async (root:any, { data }:{data:any}, { dataSources }: {dataSources:{User:any}}) => {
    const { User } = dataSources;
    return  await new User().getCurrentUser(data);
  },
};

const UserSubscription = {
  newUser: {
    subscribe: async (root:any, args:any, context:any) => {
      return  pubsub.asyncIterator(NEW_USER);
    },
  },
};

export { UserMutation, UserSubscription };
