import {groupPermit, requiresAdmin, requiresAuth} from "../../helper/permissions";


const GroupQuery = {
  // @ts-ignore
  listGroups: requiresAdmin.createResolver(async (root: any, data: any, {
    dataSources,
  }: { dataSources: { GroupControl: any }, req: any }) => {
    const {GroupControl} = dataSources;
    return await new GroupControl().listGroups(data)
  }),

  // @ts-ignore
  listUserGroups: requiresAuth.createResolver(async (root: any, data: any, {
    dataSources,
    req
  }: { dataSources: { GroupControl: any }, req: any }) => {
    const {GroupControl} = dataSources;
    return await new GroupControl().listUserGroups(req.user)
  }),

  // @ts-ignore
  listGroupMembers: requiresAuth.createResolver(async (root: any, {data}: any, {
    dataSources,
    req
  }: { dataSources: { GroupControl: any }, req: any }) => {
    const {GroupControl} = dataSources;
    return await new GroupControl().listGroupMembers(data, req.user)
  }),

  // @ts-ignore
  listGroupServers: groupPermit.createResolver(async (root: any, {data}: { data: any }, {
    dataSources,
    req
  }: { dataSources: { GroupControl: any }, req: any }) => {
    const {GroupControl} = dataSources;
    return await new GroupControl().listGroupServers(data, req.user)
  }),

}
const GroupMutation = {

// @ts-ignore
  addGroup: requiresAuth.createResolver(async (root: any, {data}: { data: { groupName: string } }, {
    dataSources,
    req
  }: { dataSources: { GroupControl: any },req:any}) => {
    const {GroupControl} = dataSources;
    return await new GroupControl().addGroup(data,req.user)
  }),

// @ts-ignore
  addGroupServer: groupPermit.createResolver(async (root: any, {data}: { data:any }, {
    dataSources,
    req
  }: { dataSources: { GroupControl: any },req:any}) => {
    const {GroupControl} = dataSources;
    return await new GroupControl().addGroupServer(data,req.user)
  }),

  // @ts-ignore
  addGroupMember: groupPermit.createResolver(async (root: any, {data}: { data:any }, {
    dataSources,
    req
  }: { dataSources: { GroupControl: any },req:any}) => {
    const {GroupControl} = dataSources;
    return await new GroupControl().addGroupMember(data,req.user)
  }),

  // @ts-ignore
  changeGroupOwnership: groupPermit.createResolver(async (root: any, {data}: { data:any }, {
    dataSources,
    req
  }: { dataSources: { GroupControl: any },req:any}) => {
    const {GroupControl} = dataSources;
    return await new GroupControl().changeGroupOwnership(data,req.user)
  }),

 // @ts-ignore
  removeGroupMember: groupPermit.createResolver(async (root: any, {data}: { data:any }, {
    dataSources,
    req
  }: { dataSources: { GroupControl: any },req:any}) => {
    const {GroupControl} = dataSources;
    return await new GroupControl().removeGroupMember(data,req.user)
  }),

  // @ts-ignore
  deleteGroupServer: groupPermit.createResolver(async (root: any, {data}: { data:any }, {
    dataSources,
    req
  }: { dataSources: { GroupControl: any },req:any}) => {
    const {GroupControl} = dataSources;
    return await new GroupControl().deleteGroupServer(data,req.user)
  }),
  // @ts-ignore
  deleteGroup: groupPermit.createResolver(async (root: any, {data}: { data:any }, {
    dataSources,
    req
  }: { dataSources: { GroupControl: any },req:any}) => {
    const {GroupControl} = dataSources;
    return await new GroupControl().deleteGroup(data,req.user)
  }),




}

export {GroupQuery, GroupMutation};
