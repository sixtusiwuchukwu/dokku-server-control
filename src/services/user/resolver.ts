import {PubSub} from "apollo-server-express";
import {Request, Response} from "express";
import {cookieOptions} from "../../tools/config";
import {requiresAuth,permitted} from "../../helper/permissions"

const pubsub = new PubSub();

const NEW_USER = "NEWUSER";
const UserMutation = {
  addUser: async (root: any, {data}: { data: any }, {dataSources}: { dataSources: { User: any } }) => {
    const {User} = dataSources;
    return await new User("s").addUser(data);
  },

  loginUser: async (root: any, data: object, {
    dataSources,
    res
  }: { dataSources: { User: any }, req: Request, res: Response }) => {
    const {User} = dataSources;
    const [accessToken, refreshAccessToken] = await new User("s").loginUser(data)
    res.cookie('x-token', accessToken, cookieOptions)
    res.cookie('x-refresh-token', refreshAccessToken, cookieOptions)
    return 'login completed'
  },
  // @ts-ignore
  updatePerson: requiresAuth.createResolver(async (root: any, {data}: { data: any }, {
    dataSources,
    req
  }: { dataSources: any, req: any }) => {
    const {User} = dataSources;
    const {user} = req

    return await new User("s").updatePerson(data,user)


  }),
  // @ts-ignore
  updatePassword: permitted.createResolver(async (root: any, data: { data: any }, {
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
    const newUser = await new User().joinGroup(data);
    await pubsub.publish(NEW_USER, { newUser: newUser });
    return newUser;
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
