import {IUser, Person} from "../../interfaces/databaseInterface/mongo";
import {AuthenticationError, UserInputError} from "apollo-server-express";
import __User from "../../models/user/user";
import __Person from "../../models/user/person";
import Base from "../../../base";
import {signJWT} from "../../helper/utils.jwt";
import crypto from 'crypto'
import loggedInInterface from "../../interfaces/AuthInterface";
import {templateName} from "../../interfaces/enums";
import {isDev} from "../../tools/config";
import {ObjectId} from "mongoose";

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
    const NotFound: string = "Unable to validate authenticated account";
    const user = await __User.findById({_id: person._id});
    if (!user) throw new AuthenticationError(NotFound)

    let foundPerson = await __Person.findOne({user: user._id});

    if (!foundPerson) {
      await __Person.create({...data, user: user._id,})
      return "updates successful"
    }
    await __Person.findOneAndUpdate({user: user._id}, {...data},)

    return "updates successful"
  }
  async forgotPassword(email:string, origin: string) {
    if(!origin) throw new Error(`expected origin but got ${origin}`)
    const account:IUser = await __User.findOne({email});
    if(!account) throw new UserInputError('Email not registered with us')
    const token = crypto.randomBytes(20).toString('hex');
    account.resetPasswordToken = token;
    account.resetPasswordExpires = new Date(Date.now() + 3600000) ;
    await (account as any).save()
    // const protocol = isDev ? "http://" : "https://"
    const url = `${origin}/reset/${token}`
    const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account is its you kindly or follow this link ${url} or click the button `
    this.sendMail(account.email, "Reset your DSAPM password", templateName.resetPassword, {message , url})
    return account._id
  }
  async resetPassword(data: {password: string, token: string}, origin:string) {
    const account:IUser = await __User.findOne({ resetPasswordToken:data.token, resetPasswordExpires: { $gt: new Date() } });
    if(!account) throw new UserInputError('Password reset token is invalid or has expired.')
    account.password = data.password;
    account.resetPasswordToken = undefined;
    account.resetPasswordExpires = undefined;
    const message = "Your password was Update successfully, if this was not you kindly request for a new password update";
    const url = `${origin}/dashboard`
    this.sendMail(account.email, "Password Updated", templateName.updatePassword, {message , url})
    const tokens: Array<string | ObjectId> = signJWT({lastReset: account.lastReset, username: account.username, email: account.email, _id: account._id}, '5s', "1h");
    tokens.push(account._id)
    return tokens
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
