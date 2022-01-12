import __User from './src/models/user/user'
import __Person from "./src/models/user/person"
import __PermissionList from "./src/models/permission/permissionLists"
import {defaultAdminAccount} from './src/tools/config'
import {FilteredList} from "./src/resolvers"
import Base from './base'

export default class DefaultScripts {
  constructor() {
    this.addDefaultAdmin().catch((e) => console.error('Error Adding default admin', e))
    this.addPermissionList(FilteredList).catch((e) => console.log("Error Adding Permission", e))
  }

  async addDefaultAdmin() {
    const user: number = await __User.countDocuments()
    let data: any = JSON.parse(defaultAdminAccount)
    let {email, password,accountType} = data
    delete data["password"]

    if (user > 0) return console.log('default account already created');
    const code: string = await new Base().getCodeNumber('uc', __User)
     await __User.create({email,password,code,accountType, username: email.split("@")[0]})
    console.log("Default Account Created")
  }

  async addPermissionList(FilteredList: String[]) {
    let permissionList: number = await __PermissionList.countDocuments()

    let data:any = []
    FilteredList.forEach((list:String) => {
      data.push({permission: list})
      return data
    })

    if (permissionList === data.length ) {
      return console.log('permission lists already created')
    }else if(permissionList > 0 && permissionList !== data.length){
      // @ts-ignore
      await __PermissionList.deleteMany({})
      await __PermissionList.insertMany(data)
      console.log('permission lists updated')
    }
    else{
      await __PermissionList.insertMany(data)
      console.log('permission lists created')
    }


  }

}
