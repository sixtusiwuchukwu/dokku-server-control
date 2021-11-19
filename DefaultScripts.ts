import __User from './src/models/user/index'
import __Person from "./src/models/user/person"
import {defaultAdminAccount} from './src/tools/config'
import Base from './base'
export default class DefaultScripts {
  constructor() {
    this.addDefaultAdmin().catch((e)=> console.error('Error Adding default admin', e))
  }
  async addDefaultAdmin() {
    const user:number = await __User.countDocuments()
    const person:number = await __Person.countDocuments()
    let data:any = JSON.parse(defaultAdminAccount)
    let {email,password} = data
     delete data["password"]

    if(user > 0 && person > 0 ) return console.log('default account already created');
    const code:string = await new Base().getCodeNumber('uc', __User)
   let response:any =  await __User.create({email,password,code})
    await __Person.create({user:response._id,...data,})

    console.log("Default Account Created")
  }

}
