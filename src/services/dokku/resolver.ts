import {permitted, requiresAuth} from "../../helper/permissions";
import DokkuAppControl from "./datasource";

const MESSAGE_SENT : string = "MESSAGE_SENT";

const DokkuAppQuery = {

};

// @ts-ignore

// @ts-ignore
const DokkuAppMutations = {
  // @ts-ignore
  createDokkuApp: requiresAuth.createResolver(async (root:any, data:any , { dataSources }:{dataSources: any}) => {
    const { DokkuAppControl } = dataSources;
    return  await new DokkuAppControl().createDokkuApp(data);
  }),

  // @ts-ignore
  startDokkuApp: requiresAuth.createResolver(async (root:any, data:any , { dataSources }:{dataSources: any}) => {
    const { DokkuAppControl } = dataSources;
    return  await new DokkuAppControl().startDokkuApp(data);
  }),

   // @ts-ignore
  stopDokkuApp: requiresAuth.createResolver(async (root:any, data:any , { dataSources }:{dataSources: any}) => {
    const { DokkuAppControl } = dataSources;
    return  await new DokkuAppControl().stopDokkuApp(data);
  }) ,

  // @ts-ignore
  stopAllDokkuApp: requiresAuth.createResolver(async (root:any, data:any , { dataSources }:{dataSources: any}) => {
    const { DokkuAppControl } = dataSources;
    return  await new DokkuAppControl().stopAllDokkuApp(data);
  }),
  // @ts-ignore
  reStartPolicy: requiresAuth.createResolver(async (root:any, data:any , { dataSources }:{dataSources: any}) => {
    const { DokkuAppControl } = dataSources;
    return  await new DokkuAppControl().reStartPolicy(data);
  }),
  // @ts-ignore
  dokkuAppReport: requiresAuth.createResolver(async (root:any, data:any , { dataSources }:{dataSources: any}) => {
    const { DokkuAppControl } = dataSources;
    return  await new DokkuAppControl().dokkuAppReport(data);
  }),
  // @ts-ignore
  reBuildDokkuApp: requiresAuth.createResolver(async (root:any, data:any , { dataSources }:{dataSources: any}) => {
    const { DokkuAppControl } = dataSources;
    return  await new DokkuAppControl().reBuildDokkuApp(data);
  }),
};

const ServerSubscription = {
  newPost: {
    subscribe: async (root:any, args:any, { pubsub }:{pubsub:any}) => {
      return pubsub.asyncIterator(MESSAGE_SENT);
    },
  },
};

export { DokkuAppQuery, DokkuAppMutations, ServerSubscription };
