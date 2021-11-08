import {IAddServerInterface, IListServersInterface} from "../../interfaces/DataSources/server";
import __Server from '../../models/servers/servers';
const { UserInputError } = require("apollo-server-express");
import Base from '../../../base';

class ServerControl extends Base {
  async listServers({ search , page }: IListServersInterface) {
    const query = {} ;
    if (search) {
      // @ts-ignore
      query["serverName"] = { $regex: search, $options: "ig" };
    }
    const options = {
      page: page,
      limit: 5,
      projection: { pkey: 0, username: 0 },
      sort: { createdAt: -1 },
      collation: {
        locale: "en",
      },
    };

    return await (__Server as any).paginate({ ...query }, options);
  }
  async addServer(data: IAddServerInterface, user:any) {
    try {
      const { username, host, pkey, port } = data;
      const ip = await this.lookUp(host)
      const isExits = await __Server.findOne({$or:[{ip:ip.address}, {ServerName: data.ServerName}]})
      if(isExits) throw new UserInputError('Server name or Ip Already exit')
      await this.RemoteServer(host, username, pkey, port);
      await __Server.create({...data, addedBy: user._id, ip:ip.address});
      return "New server Added";
    } catch (e) {
      if (e.message.includes("authentication methods failed")) {
        throw new UserInputError(
          `Cannot verify server credentials for ${data.host}`
        );
      }
      if (  e.name === "Error" ||  e.name === "TypeError" ||   e.name === "ReferenceError"  ) {
        console.log(e);
        throw new UserInputError(
          "Unable to complete server setup contact support"
        );
      }
      throw new UserInputError(e.message);
    }
  }
}

export default ServerControl;
