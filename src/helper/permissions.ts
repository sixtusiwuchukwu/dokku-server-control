import {ValidationError, AuthenticationError} from "apollo-server-express";

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
  console.log(context.req.user)
  if (!context?.req.user || !context?.req.user?._id) {
    throw new AuthenticationError('Not authenticated');
  }
});

export const requiresAdmin = (requiresAuth as any).createResolver((parent: any, args: any, context: { user: { isAdmin: any; }; }) => {
  // @ts-ignore
  if (!context?.req.user?.isAdmin) {
    throw new ValidationError('Requires admin access');
  }
});
