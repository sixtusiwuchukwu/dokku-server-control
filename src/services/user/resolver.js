const { PubSub } = require("apollo-server-express");
const pubsub = new PubSub();

const NEW_USER = "NEWUSER";
const UserMutaion = {
  joingroup: async (root, { data }, { datasources }) => {
    const { User } = datasources;
    const newuser = await new User().joinGroup(data);
    await pubsub.publish(NEW_USER, { newUser: newuser });
    return newuser;
  },
};

const UserSubscription = {
  newUser: {
    subscribe: async (root, args, context) => {
      return await pubsub.asyncIterator(NEW_USER);
    },
  },
};

module.exports = { UserMutaion, UserSubscription };
