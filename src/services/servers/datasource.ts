import {
  AddServerMemberInterface,
  IAddServerInterface,
  IListServersInterface,
} from "../../interfaces/DataSources/server";
import __Server from '../../models/servers/servers';
import __User from '../../models/user/user';
import Base from '../../../base';

const {UserInputError} = require("apollo-server-express");

class ServerControl extends Base {
  async listServers({search, page}: IListServersInterface) {
    const query: any = {};
    if (search) {
      query["serverName"] = {$regex: search, $options: "ig"};
    }
    const options = {
      page: page,
      limit: 5,
      projection: {pkey: 0, username: 0},
      sort: {createdAt: -1},
      collation: {
        locale: "en",
      },
    };

    return await (__Server as any).paginate({...query}, options);
  }

  async addServer(data: IAddServerInterface, user: any) {
    try {
      const {username, host, pkey, port} = data;
      const ip = await this.lookUp(host)
      const isExits = await __Server.findOne({$or: [{ip: ip.address}, {ServerName: data.ServerName}]})
      if (isExits) throw new UserInputError('Server name or Ip Already exit')
      await this.RemoteServer(host, username, pkey, port);
      await __Server.create({...data, owner: user._id, ip: ip.address});
      return "New server Added";
    } catch (e) {
      if (e.message.includes("authentication methods failed")) {
        throw new UserInputError(
          `Cannot verify server credentials for ${data.host}`
        );
      }
      if (e.name === "Error" || e.name === "TypeError" || e.name === "ReferenceError") {
        console.log(e);
        throw new UserInputError(
          "Unable to complete server setup contact support"
        );
      }
      throw new UserInputError(e.message);
    }
  }

  async addServerMember(data: AddServerMemberInterface, user: any) {
    const {serverId, email, permission} = data

    let foundServer = await __Server.findOne({_id: serverId, owner: user._id})


    if (!foundServer) {
      throw new UserInputError("Server Not Found")
    }
    let member = {email, permission}
    // @ts-ignore
    let isUser = await __User.findOne({email: email})

    if (!isUser) throw new UserInputError("user not found")

    let isExist = await __Server.findOne({"members.email":email})
    if(isExist)throw new UserInputError("Member Already Added")
    await __Server.findOneAndUpdate({_id: serverId, owner: user._id}, {$addToSet: {members: member}})

    return "member added successfully"
  }

  async listUserServers(user: any) {
    let foundServer = await __Server.find({owner: user._id})
    // console.log(foundServer)
    if (!foundServer) {
      return []
    }
    return foundServer

  }

  async changeServerOwnership(data: any,) {
    let foundServer = await __Server.findById(data.serverId)
    if (!foundServer) {
      return "error changing ownerShip"
    }
    let isUser = await __User.findOne({email: data.email})

    if (!isUser) throw new UserInputError("user not found")
    foundServer.owner = isUser._id
    await foundServer.save()

    return "server ownership changed"

  }

  async listServerMembers(data: any, user: any) {

    let {members} = await __Server.findById(data.serverId).select("members")
    if (!members) {
      return "server not found"
    }
    // @ts-ignore
    if (members.length === 0) return []
    return members

  }

  async importServerToGroup(data: any, user: any) {
    const {serverId, groupId} = data
    await __Server.findOneAndUpdate({_id: serverId, owner: user._id}, {groupId})

    return "imported successfully"

  }
  async deleteServer(data: any, user: any) {
    const {serverId} = data
    await __Server.findOneAndDelete({_id: serverId, owner: user._id}, )

    return "Deleted Successfully"

  }
}

export default ServerControl;
