import {AuthenticationError, ForbiddenError, ValidationError} from "apollo-server-express";
import __Server from "../models/servers/servers"
import __Group from "../models/groups/groups"

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

export const serverPermit = (requiresAuth as any).createResolver(async (parent: any, {data}: any, context: any, info: any) => {
  const {req: {user}} = context

  const isPermit = await __Server.findOne({$or:[{
    _id:data?.serverId,
    "members.email": user?.email,
    "members.permission": {"$in": [info.fieldName]}
  },{_id: data?.serverId,owner:user?._id}]})


  if (!isPermit) {
    throw new ForbiddenError('operation not allowed')
  }
});
export const groupPermit = (requiresAuth as any).createResolver(async (parent: any, {data}: any, context: any, info: any) => {
  const {req: {user}} = context

  const isPermit = await __Group.findOne({$or:[{
    _id:data?.groupId,
    "members.email": user?.email,
    "members.permission": {"$in": [info.fieldName]}
  },{_id: data?.groupId,owner:user?._id}]})


  if (!isPermit) {
    throw new ForbiddenError('operation not allowed')
  }
})
