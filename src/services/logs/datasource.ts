import Base from "../../../base";
import {IListServersInterface} from "../../interfaces/DataSources/server";
import __Logs from "../../models/logs/logs"

class LogsControl extends Base {

 async getLogs({search, page}: IListServersInterface){
   const query: any = {};
   if (search) {
     query["serviceName"] = {$regex: search, $options: "ig"};

   }
   const options = {
     page: page,
     limit: 5,
     sort: {createdAt: -1},
     collation: {
       locale: "en",
     },
   };

   return await (__Logs as any).paginate({...query}, options);
 }

async getUserLogs({search, page}: IListServersInterface,){
   const query: any = {};
   if (search) {
     query["serviceName"] = {$regex: search, $options: "ig"};
      // query["user"] =
   }
   const options = {
     page: page,
     limit: 5,
     sort: {createdAt: -1},
     collation: {
       locale: "en",
     },
   };

   return await (__Logs as any).paginate({...query}, options);
 }
}

export default LogsControl