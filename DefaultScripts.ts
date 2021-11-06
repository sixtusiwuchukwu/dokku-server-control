import User from './src/models/user/index'
import {defaultAdminAccount} from './src/tools/config'
import Base from './base'
export default class DefaultScripts {
  constructor() {
    this.addDefaultAdmin().catch((e)=> console.error('Error Adding default admin', e))
  }
  async addDefaultAdmin() {
    const user:number = await User.countDocuments()
    if(user > 0) return console.log('default account already created');
    const code:string = await new Base(["all"]).getCodeNumber('uc', User)
    await User.create({code,...JSON.parse(defaultAdminAccount)})
    console.log("Default Account Created")
  }
}
