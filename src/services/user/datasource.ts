import {IUser, Person} from "../../interfaces/databaseInterface/mongo";
import {UserInputError} from "apollo-server-express";
import __User from "../../models/user/user";
import __Person from "../../models/user/person";
import Base from "../../../base";
import {signJWT} from "../../helper/utils.jwt";

class UserDatasource extends Base {
  async getCurrentUser(data: any) {
    return "sd"
  }

  async addUser(data: IUser) {
    const {email} = data;
    const user = await __User.findOne({email})
    if (user) throw new UserInputError('email, already exist');
    const code = await this.getCodeNumber('uc', __User)
    await __User.create({...data, code})

    await  this.sendMail("deeptech@gmail.com","sixtusiwuchukwu21@gmail.com","welcome","welcome",{name:user.email})

    return "Successfully created an Account"
  }

  async loginUser({email, password}: { email: string, password: string }) {
    const NotFound: string = "Invalid login credentials";
    const user = await __User.findOne({email});
    if (!user) throw new UserInputError(NotFound)
    // @ts-ignore

    const isPass = await __User.comparePassword(user.password, password)
    if (!isPass) throw new UserInputError(NotFound);

    // @ts-ignore
    return signJWT({lastReset: user.lastReset, username: user.username, email: user.email, _id: user._id}, '5s', "1h");
  }

  // @ts-ignore
  async updatePerson(data: Person, person: Person) {
    const NotFound: string = "User not found";
    const user = await __User.findById({_id: person._id});
    if (!user) throw new UserInputError(NotFound)

    let foundPerson = await __Person.findOne({user: user._id});

    if (!foundPerson) {
      await __Person.create({...data, user: user._id,})
      return "updates successful"
    }
    await __Person.findOneAndUpdate({user: user._id}, {...data},)

    return "updates successful"
  }

  // @ts-ignore
  async updatePassword({oldPassword,newPassword}, person: Person) {
    const NotFound: string = "User not found";

    const user = await __User.findById({_id: person._id});
    if (!user) throw new UserInputError(NotFound)


  // @ts-ignore
    let isPassword = await __User.comparePassword(user.password,oldPassword)
    if(!isPassword) throw new UserInputError(NotFound)

    user.password = newPassword

    await user.save()

    return "updates successful"
  }
}

export default UserDatasource;
