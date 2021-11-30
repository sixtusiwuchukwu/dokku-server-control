import {groupPermit, requiresAdmin, requiresAuth} from "../../helper/permissions";

const LogsQuery = {
  getLogs: requiresAdmin.createResolver(async (root: any, data: any, {dataSources}: { dataSources: { LogControl: any }, req: any }) => {
    const {LogControl} = dataSources
    return await new LogControl().getLogs(data)
  }),
  getUserLogs: requiresAdmin.createResolver(async (root: any, data: any, {dataSources}: { dataSources: { LogControl: any }, req: any }) => {
    const {LogControl} = dataSources
    return await new LogControl().getUserLogs(data)
  })
}

export {LogsQuery}