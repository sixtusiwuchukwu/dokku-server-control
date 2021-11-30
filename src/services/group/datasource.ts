import Base from "../../../base";
import __Groups from "../../models/groups/groups"
import __Group from "../../models/groups/groups"
import __Server from "../../models/servers/servers"
import {UserInputError} from "apollo-server-express";
import {IListServersInterface} from "../../interfaces/DataSources/server";
import __User from "../../models/user/user";
import mongoose from "mongoose";
import servers from "../../models/servers/servers";


class GroupControl extends Base {
  async addGroup(data: any, user: any) {
    let foundGroup = await __Groups.findOne({groupName: data.groupName})
    if (foundGroup) throw new UserInputError("group name already exist")
    await __Groups.create({...data, owner: user._id})
    return "Group successfully created"
  }

  async addGroupServer(data: any, user: any) {
    try {
      const {username, host, pkey, port} = data;

      let foundGroup = await __Groups.findOne({_id: data.groupId})

      if (!foundGroup) throw new UserInputError("group not found")

      const ip = await this.lookUp(host)
      // let ip = {address:"192.168.964"}

      const foundServer = await __Server.findOne({$or: [{ip: ip.address}, {serverName: data.serverName}]})

      if (foundServer) throw new UserInputError("Server name or Ip Already exist")

      let newServer = await __Server.create({...data, owner: user._id, ip: ip.address, inGroup: true})

      await __Group.findOneAndUpdate({_id: data.groupId, owner: user._id}, {$addToSet: {servers: newServer._id}})

      await this.RemoteServer(host, username, pkey, port);

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

  async listGroups({search, page}: IListServersInterface) {
    const query: any = {};
    query["status "] = "active"
    if (search) {
      query["groupName"] = {$regex: search, $options: "ig"};
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

    return await (__Group as any).paginate({...query}, options);
  }

  async listUserGroups(user: any) {
    let foundGroup = await __Group.find({owner: user._id})

    if (!foundGroup) {
      return []
    }
    return foundGroup
  }

  async listGroupMembers(data: any, user: any) {
    let {members} = await __Group.findById(data.groupId).select("members")
    if (!members) {
      return "Group not found"
    }
    // @ts-ignore
    if (members.length === 0) return []
    return members
  }

  async addGroupMember(data: any, user: any) {
    const {groupId, email, permission} = data

    let foundGroup = await __Group.findOne({_id: groupId, owner: user._id})


    if (!foundGroup) {
      throw new UserInputError("Group Not Found")
    }
    let member = {email, permission}
    // @ts-ignore
    let isUser = await __User.findOne({email: email})

    if (!isUser) throw new UserInputError("user not found")

    let isExist = await __Group.findOne({"members.email": email})
    if (isExist) throw new UserInputError("Member Already Added")
    await __Group.findOneAndUpdate({_id: groupId, owner: user._id}, {$addToSet: {members: member}})

    return "member added successfully"
  }

  async changeGroupOwnership(data: any, user: any) {
    let foundGroup = await __Group.findOne({_id: data.serverId, owner: user._id})
    if (!foundGroup) {
      return "error changing ownerShip"
    }
    let isUser = await __User.findOne({email: data.email})

    if (!isUser) throw new UserInputError("user not found")
    foundGroup.owner = isUser._id

    await foundGroup.save()

    return "Group ownership changed"

  }

  async removeGroupMember(data: any, user: any) {
    await __Group.findOneAndUpdate({_id: data.groupId, owner: user._id}, {$pull: {members: {email: data.memberEmail}}})
    return "member removed successfully"

  }

  async deleteGroupServer(data: any, user: any) {
    let foundServer = await __Server.findOne({_id: data.serverId, owner: user._id,})
    if (!foundServer) {
      return "server not found"
    }
    foundServer.status = "deleted"
    await foundServer.save()
    return "server removed successfully"
  }

  async deleteGroup(data: any, user: any) {
    let foundGroup = await __Group.findOne({_id: data.serverId, owner: user._id,})
    if (!foundGroup) {
      return "Group not found"
    }
    foundGroup.status = "deleted"
    await foundGroup.save()
    return "Group removed successfully"
  }

  async listGroupServers(data: any, user: any) {

    const servers = await __Group.aggregate([
      {
        '$match': {
          '_id':  mongoose.Types.ObjectId(data.groupId)
        }
      }, {
        '$lookup': {
          'from': 'servers',
          'localField': 'servers',
          'foreignField': '_id',
          'as': 'servers'
        },
      },
      {"$project":{servers:1}}
    ]);
    return servers[0]?.servers || []
  }

}

export default GroupControl;
