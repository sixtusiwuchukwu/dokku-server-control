import Base from "../../../base";
import __Groups from "../../models/groups/groups"
import {UserInputError} from "apollo-server-express";


class GroupControl extends Base {
  async addGroup(data: any, user: any) {
    let foundGroup = await __Groups.findOne({groupName: data.groupName})
    if (foundGroup) throw new UserInputError("group name already exist")
    await __Groups.create({...data,owner:user._id})
    return "Group successfully created"
  }
}

export default GroupControl;
