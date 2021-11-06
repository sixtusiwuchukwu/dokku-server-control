import {IUser} from "../../interfaces/datebaseInterface/mongo";
import {UserInputError} from "apollo-server-express";
import User from "../../models/user";
import Base from "../../../base";
import {signJWT} from "../../helper/utils.jwt";

class UserDatasource extends Base{
  async getCurrentUser(data: any) {
    return "sd"
  }

  async addUser(data: IUser) {
    const {username, email, phone} = data;
    const user = await User.findOne({"$or": [{username}, {email}, {phone}]})
    if (user) throw new UserInputError('email, phone or username already exist');
    const code = await this.getCodeNumber('uc', User)
    await User.create({...data, code})
    return "New Server created"
  }
  async loginUser({accountId, password}:{accountId:string, password:string}) {
    const NotFound:string = "Invalid login credentials";
    const user = await User.findOne({"$or":[{username:accountId}, {email: accountId}, {phone: accountId}]}, {username:1,email:1, password:1, lastReset: 1});
    if(!user) throw new UserInputError(NotFound)
    // @ts-ignore
    const isPass = await User.comparePassword(user.password, password)
    if(!isPass) throw new UserInputError(NotFound);
    return signJWT({lastReset:user.lastReset,username: user.username, email:user.email, _id: user._id}, '5s', "1h")
  }
}

export default UserDatasource;
