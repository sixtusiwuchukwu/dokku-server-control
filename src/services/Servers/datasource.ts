import {IAddServerInterface, IListServersInterface} from "../../interfaces/DataSources/server";

const __Server = require("../../models/servers/servers");
const { UserInputError } = require("apollo-server-express");
const Base = require("../../../base");

class ServerDatasource extends Base {
  constructor(props:any) {
    super(props);
  }
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

    return await __Server.paginate({ ...query }, options);
  }
  async addServer(data: IAddServerInterface) {
    try {
      const { username, host, pkey, port } = data;
      await this.RemoteServer(host, username, pkey, port);
      await __Server.create(data);
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
  async stopServer(data:{_id: string}) {
    let FoundServer = await __Server.findById( data._id );

    if (!FoundServer) {
      throw new UserInputError("Unable to stop server");
    }
    const { host, username, pkey } = FoundServer;
    try {
      await this.RemoteServer(host, username, pkey);
      await this.RemoteServer.execCommand(`dokku ps:stop${host}`);
    } catch (e) {
      if (e.message.includes("authentication methods failed")) {
        throw new UserInputError(
          `Cannot verify server credentials for ${host}`
        );
      }
      if ( e.name === "Error" ||  e.name === "TypeError" ||  e.name === "ReferenceError" ) {
        console.log(e);
        throw new UserInputError(
          "Unable to complete server setup contact support"
        );
      }
      throw new UserInputError(e.message);
    }
  }

  async StartServer(data: { _id: string }) {
    const { _id } = data;
    let FoundServer = await __Server.findOne({ _id });

    if (!FoundServer) {
      throw new UserInputError("Unable to stop server");
    }
    const { host, username, pkey } = FoundServer;

    await this.RemoteServer(host, username, pkey);

    await this.RemoteServer.execCommand(`dokku ps:start${host}`);
  }
}

module.exports = ServerDatasource;
