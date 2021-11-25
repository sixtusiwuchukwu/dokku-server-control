import {ObjectId} from "mongoose"

export interface IListServersInterface {
    search?: string
    page: number
    serverName: string
}
export interface IAddServerInterface {
    ServerName: string;
    username:string
    host:string
    pkey:string
    port:number
}

export interface  AddServerMemberInterface {
    serverId:ObjectId
    email: String
    permission:Array<string>
}
export interface  changeServerOwnershipInterface {
    serverId:ObjectId
    email: String
}

export interface importServerToGroupInterface {
    serverId:ObjectId
    groupId:ObjectId
}
