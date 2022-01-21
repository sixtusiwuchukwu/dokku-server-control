import { ObjectId } from 'mongoose';
enum accountType {
  admin,
  user
}
type GroupMembers = {
  permission:Array<string>
  memberId:string
}

export type PluginType = {
  name:string
  url:string
  command:Array<string>
}
export interface GroupMember {
  permission:Array<string>
  memberId:string
}

export interface IServers {
  username: string
  port: number
  host: string
  owner:ObjectId
  serverName: string
  members:Array<GroupMembers>
  inGroup:Boolean
  ip: string
  pkey: string
  createdAt: Date
  updatedAt: Date
  status:string
  plugin:Array<string>
}
export interface IUser {
  _id:ObjectId
  email:string
  password: string
  code:string
  lastReset:Date
  username: string
  accountType: accountType
  resetPasswordToken:string
  resetPasswordExpires: Date
  createdAt: Date
  updatedAt: Date
}
export interface  Person {
  _id:ObjectId
  username:string
  phone: string
  lastReset:string
  firstName: string
  lastName: string
  permissions: Array<string>
  blackListCommands: Array<string>
  whiteListCommands: Array<string>
  isBlocked: boolean
  allowedRoutes: Array<string>
  address:Array<object>
  createdAt: Date
  updatedAt: Date
}
export interface Group {
  _id:ObjectId
  groupName:string
  members:Array<GroupMembers>
  servers:Array<ObjectId>
  status:string
  owner:ObjectId
  updatedAt:Date
  createdAt:Date
}

export interface Logs {
  _id:ObjectId
  user:ObjectId
  serviceName:string
  ip:string
  createdAt:Date
  updateAt:Date
}

export interface PermissionInterface {
  permission:string
}

export interface PluginInterface {
  name:string
  url:string
  command:Array<string>
}




