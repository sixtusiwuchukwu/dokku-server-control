import {ObjectId} from 'mongoose'
enum accountType {
  admin,
  user
}

export interface IServers {
  username: string
  port: number
  host: string
  addedBy:ObjectId
  serverName: string
  ip: string
  pkey: string
  createdAt: Date
  updatedAt: Date
}
export interface IUser {
  username:string
  code:string
  phone: string
  lastReset:string
  email:string
  password: string
  firstName: string
  lastName: string
  permissions: Array<string>
  blackListCommands: Array<string>
  whiteListCommands: Array<string>
  isBlocked: boolean
  allowedRoutes: Array<string>
  accountType: accountType
  createdAt: Date
  updatedAt: Date
}
