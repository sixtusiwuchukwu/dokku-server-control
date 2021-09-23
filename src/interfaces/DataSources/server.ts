export interface IListServersInterface {
    search?: string
    page: number
    serverName: string
}
export interface IAddServerInterface {
    username:string
    host:string
    pkey:string
    port:number
}
