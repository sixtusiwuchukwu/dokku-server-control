import {
  AddServerMemberInterface,
  IAddServerInterface,
  IListServersInterface,
} from "../../interfaces/DataSources/server";
import __Server from '../../models/servers/servers';
import __User from '../../models/user/user';
import __Group from "../../models/groups/groups"
import Base from '../../../base';

const {UserInputError} = require("apollo-server-express");

class ServerControl extends Base {
  async listServers({search, page}: IListServersInterface) {
    const query: any = {};
    if (search) {
      query["serverName"] = {$regex: search, $options: "ig"};
      query["status"] = "active"
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
      // let ip = {address:"192.168.13"}
      const ip = await this.lookUp(host)
      const isExits = await __Server.findOne({$or: [{ip: ip.address}, {serverName: data.serverName}]})
      if (isExits) throw new UserInputError('Server name or Ip Already exist')
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

    let isExist = await __Server.findOne({"members.email": email})
    if (isExist) throw new UserInputError("Member Already Added")
    await __Server.findOneAndUpdate({_id: serverId, owner: user._id}, {$addToSet: {members: member}})

    return "member added successfully"
  }

  async listUserServers({search,page}:any,user: any) {

    const query: any = {};
    query["status"] = "active"
    if (search) {
      query["serverName"] = {$regex: search, $options: "ig"};
      query["owner"] = user._id;
      query["inGroup"] = false
      query["status"] = "active"
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

  async changeServerOwnership(data: any,user:any) {
    let foundServer = await __Server.findOne({_id:data.serverId,owner:user._id})
    if (!foundServer) {
      return "error changing ownerShip"
    }
    let isUser = await __User.findOne({email: data.email})

    if (!isUser) throw new UserInputError("user not found")
    foundServer.owner = isUser._id
    // @ts-ignore
    foundServer.InGroup = false

    await foundServer.save()

    return "server ownership changed"

  }

  async listServerMembers(data: any) {

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

    let foundServer = await __Server.findOne({_id: serverId, owner: user._id})

    if (!foundServer) throw new UserInputError("user server not found")

    let foundGroup = await __Group.findOne({_id: groupId, owner: user._id})

    if (!foundGroup) throw new UserInputError("user group not found")


    await __Group.findOneAndUpdate({_id: groupId, owner: user._id}, {$addToSet: {servers: serverId}})
    await __Server.findOneAndUpdate({_id: serverId, owner: user._id}, {inGroup:true})

    return "imported successfully"

  }

  async deleteServer(data: any, user: any) {
    const {serverId} = data
    let foundServer = await __Server.findOne({_id:serverId, owner: user._id,})
    if (!foundServer) {
      return "server not found"
    }
    foundServer.status = "deleted"
    return "Deleted Successfully"

  }

  async removeServerMember(data: any, user: any) {
    await __Server.findOneAndUpdate({_id: data.serverId, owner: user._id}, {$pull: {members: {email: data.memberEmail}}})
    return "member removed successfully"

  }
}

export default ServerControl;
