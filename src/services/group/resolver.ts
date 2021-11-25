import {requiresAuth} from "../../helper/permissions";

const GroupQuery = {}
const GroupMutation = {

// @ts-ignore
  addGroup: requiresAuth.createResolver(async (root: any, {data}: { data: { groupName: string } }, {
    dataSources,
    req
  }: { dataSources: { GroupControl: any },req:any}) => {
    const {GroupControl} = dataSources;
    return await new GroupControl().addGroup(data,req.user)
  })

}

export {GroupQuery, GroupMutation};
