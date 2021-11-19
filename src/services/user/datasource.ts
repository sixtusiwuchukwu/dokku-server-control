import {IUser,Person} from "../../interfaces/databaseInterface/mongo";
import {UserInputError} from "apollo-server-express";
import __User from "../../models/user";
import __Person from "../../models/user/person";
import Base from "../../../base";
import {signJWT} from "../../helper/utils.jwt";
import person from "../../models/user/person";
import mongoose from "mongoose";

class UserDatasource extends Base{
  async getCurrentUser(data: any) {
    return "sd"
  }

  async addUser(data: IUser) {
    const { email} = data;
    const user = await __User.findOne({email})
    if (user) throw new UserInputError('email, already exist');
    const code = await this.getCodeNumber('uc', __User)
    let response = await __User.create({...data, code})
    await __Person.create({email:response.email,user:response._id})

    return "Successfully created an Account"
  }
  async loginUser({email, password}:{email:string, password:string}) {
    const NotFound:string = "Invalid login credentials";
    const user = await __User.findOne({email});
    if(!user) throw new UserInputError(NotFound)
    // @ts-ignore

    const isPass = await __User.comparePassword(user.password, password)
    if(!isPass) throw new UserInputError(NotFound);
    const person = await __Person.findOne({user:user._id})
    return signJWT({lastReset: person.lastReset, username: person.username, email: user.email, _id: user._id}, '5s', "1h");
  }


  async updatePerson(data:Person,person:Person){
    const NotFound:string = "User not found";
    const user = await __User.findById({_id:person._id});
    if(!user) throw new UserInputError(NotFound)
  let d =  await __Person.findOneAndUpdate({user:user._id},{...data},{new:true})
    console.log(d)
    return "updates successful"
  }
}

export default UserDatasource;
