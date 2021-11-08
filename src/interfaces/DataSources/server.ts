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
