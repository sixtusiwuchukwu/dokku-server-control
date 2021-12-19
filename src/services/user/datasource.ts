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
    await this.userValidation(data)
    const {email} = data;
    const user = await __User.findOne({email})
    if (user) throw new UserInputError('email, already exist');
    const code = await this.getCodeNumber('uc', __User)
    const account = await __User.create({...data, code})
    this.sendMail(account.email, "Welcome To DSPM", "welcome", {name: account.email.split('@')[0]})
    return "Successfully created an Account"
  }

  async loginUser({email, password}: { email: string, password: string }) {
    const NotFound: string = "Invalid login credentials";
    const user = await __User.findOne({email});
    if (!user) throw new UserInputError(NotFound)

    const isPass = await (__User as any).comparePassword(user.password, password)
    if (!isPass) throw new UserInputError(NotFound);

    return signJWT({lastReset: user.lastReset, username: user.username, email: user.email, _id: user._id}, '5s', "1h");
  }

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

  async updatePassword({oldPassword, newPassword}: { oldPassword: string, newPassword: string }, person: Person) {
    const NotFound: string = "User not found";

    const user = await __User.findById({_id: person._id});
    if (!user) throw new UserInputError(NotFound)

    let isPassword = await (__User as any).comparePassword(user.password, oldPassword)
    if (!isPassword) throw new UserInputError(NotFound)

    user.password = newPassword

    await user.save()

    return "updates successful"
  }
}

export default UserDatasource;
