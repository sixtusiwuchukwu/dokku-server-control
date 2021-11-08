import {ValidationError, AuthenticationError, ForbiddenError} from "apollo-server-express";

const createResolver = (resolver: (parent: any, args: any, context: any, info: any) => void) => {
  const baseResolver = resolver;
  (baseResolver as any).createResolver = (childResolver: (arg0: any, arg1: any, arg2: any, arg3: any) => any) => {
    const newResolver = async (parent: any, args: any, context: any, info: any) => {
      await resolver(parent, args, context, info);
      return childResolver(parent, args, context, info);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

export const requiresAuth = createResolver((parent, args, context) => {
  if (!context?.req.user || !context?.req.user?._id) {
    throw new AuthenticationError('Not authenticated');
  }
});

export const requiresAdmin = (requiresAuth as any).createResolver((parent: any, args: any, context: any) => {
  // @ts-ignore
  if (!context?.req.user?.isAdmin) {
    throw new ValidationError('Requires admin access');
  }
});

export const permitted = (requiresAuth as any).createResolver((parent: any, args:any, context:any, info:any)=> {
  const permissions = ["startDokkuApp", "stopServer", "listServers"]
  if(!permissions.includes(info.fieldName)){
    throw new ForbiddenError('operation not allowed')
  }
  // if(!context?.req?.user?.permissions?.includes("")){
  //   throw new ForbiddenError('operation not allowed')
  // }
})
