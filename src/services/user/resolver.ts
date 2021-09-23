import { PubSub } from "apollo-server-express";
const pubsub = new PubSub();

const NEW_USER = "NEWUSER";
const UserMutation = {
  joingroup: async (root:any, { data }:{data:any}, { datasources }: {datasources:{User:any}}) => {
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
