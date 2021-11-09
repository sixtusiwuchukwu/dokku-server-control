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
  StopAllDokkuApp: requiresAuth.createResolver(async (root:any, data:any , { dataSources }:{dataSources: any}) => {
    const { DokkuAppControl } = dataSources;
    return  await new DokkuAppControl().stopAllDokkuApp(data);
  }),
  // @ts-ignore
  restartPolicy: requiresAuth.createResolver(async (root:any, data:any , { dataSources }:{dataSources: any}) => {
    const { DokkuAppControl } = dataSources;
    return  await new DokkuAppControl().restartPolicy(data);
  }),
  // @ts-ignore
  DokkuAppReport: requiresAuth.createResolver(async (root:any, data:any , { dataSources }:{dataSources: any}) => {
    const { DokkuAppControl } = dataSources;
    return  await new DokkuAppControl().DokkuAppReport(data);
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
