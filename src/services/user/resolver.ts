import {PubSub} from "apollo-server-express";
import {Request, Response} from "express";
import {cookieOptions} from "../../tools/config";

const pubsub = new PubSub();

const NEW_USER = "NEWUSER";
const UserMutation = {
  addUser: async (root:any, { data }:{data:any}, { datasources }: {datasources:{User:any}}) => {
    const { User } = datasources;
    return await new User("s").addUser(data);
  },

  loginUser: async (root:any, data:object, { datasources, req, res }: {datasources:{User:any}, req: Request, res: Response}) => {
    const { User } = datasources;
    const [accessToken, refreshAccessToken ] = await new User("s").loginUser(data);
    res.cookie('x-token',accessToken, cookieOptions)
    res.cookie('x-refresh-token',refreshAccessToken, cookieOptions)
    return 'login completed'
  },
};
const UserQuery = {
  getCurrentUser: async (root:any, { data }:{data:any}, { datasources }: {datasources:{User:any}}) => {
    const { User } = datasources;
    const newuser = await new User().joinGroup(data);
    await pubsub.publish(NEW_USER, { newUser: newuser });
    return newuser;
  },
};

const UserSubscription = {
  newUser: {
    subscribe: async (root:any, args:any, context:any) => {
      return await pubsub.asyncIterator(NEW_USER);
    },
  },
};

export { UserMutation, UserSubscription };
