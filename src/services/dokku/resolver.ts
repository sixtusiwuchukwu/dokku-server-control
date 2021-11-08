import {permitted, requiresAuth} from "../../helper/permissions";
import DokkuAppControl from "./datasource";

const MESSAGE_SENT : string = "MESSAGE_SENT";

const DokkuAppQuery = {

};

// @ts-ignore

const DokkuAppMutations = {
  // @ts-ignore
  startDokkuApp: requiresAuth.createResolver(async (root:any, data:any , { dataSources }:{dataSources: any}) => {
    const { DokkuAppControl } = dataSources;
    return  await new DokkuAppControl().startDokkuApp(data);
  })
};

const ServerSubscription = {
  newPost: {
    subscribe: async (root:any, args:any, { pubsub }:{pubsub:any}) => {
      return pubsub.asyncIterator(MESSAGE_SENT);
    },
  },
};

export { DokkuAppQuery, DokkuAppMutations, ServerSubscription };
