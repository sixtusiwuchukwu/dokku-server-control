import {ObjectId} from 'mongoose'
export interface IServers {
  username: string
  port: number
  host: string
  addedBy:ObjectId
  serverName: string
  pkey: string
  createdAt: Date
  updatedAt: Date
}
