import { ObjectId } from 'mongoose';
enum accountType {
  admin,
  user
}
type GroupMembers = {
  permission:Array<string>
  memberId:string
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
  ip: string
  pkey: string
  createdAt: Date
  updatedAt: Date
}
export interface IUser {
  _id:ObjectId
  email:string
  password: string
  code:string
  accountType: accountType
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
  owner:ObjectId
  updatedAt:Date
  createdAt:Date
}


