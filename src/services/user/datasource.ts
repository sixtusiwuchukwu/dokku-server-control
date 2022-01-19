import {IUser, Person} from "../../interfaces/databaseInterface/mongo";
import {AuthenticationError, UserInputError} from "apollo-server-express";
import __User from "../../models/user/user";
import __Person from "../../models/user/person";
import Base from "../../../base";
import {signJWT} from "../../helper/utils.jwt";
import crypto from 'crypto'
import loggedInInterface from "../../interfaces/AuthInterface";
class UserDatasource extends Base {
  async getCurrentUser(user:loggedInInterface) {
    return __User.findById(user._id, {username:1, email:1, code:1, accountType:1 })
  }

  async addUser(data: IUser) {
    await this.userValidation(data)
    const {email} = data;
    const user = await __User.findOne({email})
    if (user) throw new UserInputError('Account already exist');
    const code = await this.getCodeNumber('uc', __User)
    const account = await __User.create({...data,username: data.email.split('@')[0], code})
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

  async updatePerson(data: Person, account: loggedInInterface) {
    const NotFound: string = "Unable to validation authenticated account";
    const user = await __User.findById({_id: account._id});
    if (!user) throw new AuthenticationError(NotFound)

    let foundPerson = await __Person.findOne({user: user._id});

    if (!foundPerson) {
      await __Person.create({...data, user: user._id,})
      return "updates successful"
    }
    await __Person.findOneAndUpdate({user: user._id}, {...data},)

    return "updates successful"
  }
  async forgotPassword(email:string, host: string) {
    const account:IUser = await __User.findOne({email});
    if(!account) throw new UserInputError('Email not registered with us')
    const token = crypto.randomBytes(20).toString('hex');
    account.resetPasswordToken = token;
    account.resetPasswordExpires = new Date(Date.now() + 3600000) ;
    await (account as any).save()
    const url = `https://${host}/reset/${token}`
    const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account is its you kindly or follow this link ${url} or click the button `
    this.sendMail(account.email, "Reset your DSAPM password", "resetPassword", {message , url})
  }

  async updatePassword({oldPassword, newPassword}: { oldPassword: string, newPassword: string }, account: loggedInInterface) {
    const NotFound: string = "Unable to validate account";

    const user:IUser = await __User.findById({_id: account._id});
    if (!user) throw new UserInputError(NotFound)

    let isPassword = await (__User as any).comparePassword(user.password, oldPassword)
    if (!isPassword) throw new UserInputError(NotFound)

    user.password = newPassword

    await (user as any).save()

    return "updates successful"
  }


}
export default UserDatasource;
