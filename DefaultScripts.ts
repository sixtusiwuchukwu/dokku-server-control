import __User from "./src/models/user/user";
import __Person from "./src/models/user/person";
import __PermissionList from "./src/models/permission/permissionLists";
import __Plugin from "./src/models/plugin/plugin";
import { defaultAdminAccount } from "./src/tools/config";
import { FilteredList } from "./src/resolvers";
// import  * as defaultPlugins from "./src/tools/defaultPlugins.json"
const defaultPlugins = require("./src/tools/defaultPlugins.json");
import Base from "./base";
import { PluginType } from "./src/interfaces/databaseInterface/mongo";
// const  {PluginType} = require ('src/interfaces/databaseInterface/mongo')

export default class DefaultScripts {
  constructor() {
    this.addDefaultAdmin().catch((e) =>
      console.error("Error Adding default admin", e)
    );
    this.addPermissionList(FilteredList).catch((e) =>
      console.log("Error Adding Permission", e)
    );
    this.addPluginList().catch((e) => console.log("Error Adding Plugins", e));
  }

  async addDefaultAdmin() {
    const user: number = await __User.countDocuments();
    const person: number = await __Person.countDocuments();
    let data: any = JSON.parse(defaultAdminAccount);
    let { email, password, accountType } = data;
    delete data["password"];

    if (user > 0) return console.log("default account already created");
    const code: string = await new Base().getCodeNumber("uc", __User);
    await __User.create({ email, password, code, accountType });

    console.log("Default Account Created");
  }

  async addPermissionList(FilteredList: String[]) {
    let permissionList: number = await __PermissionList.countDocuments();

    let data: any = [];
    FilteredList.forEach((list: String) => {
      data.push({ permission: list });
      return data;
    });

    if (permissionList === data.length) {
      return console.log("permission lists already created");
    } else if (permissionList > 0 && permissionList !== data.length) {
      // @ts-ignore
      await __PermissionList.deleteMany({});
      await __PermissionList.insertMany(data);
      console.log("permission lists updated");
    } else {
      await __PermissionList.insertMany(data);
      console.log("permission lists created");
    }
  }

  async addPluginList() {
    const plugin: PluginType[] = await __Plugin.find({});

    let data: PluginType[] = defaultPlugins;

    let filtered: PluginType[] = data.filter((item) => {
      return plugin
        .map((plugin) => plugin.name)
        .filter((__, _, array) => !array.includes(item.name)).length;
    });

    if (filtered.length === 0) {
      console.log("Default Plugins Already Added");
    } else if (plugin.length === 0) {
      await __Plugin.insertMany(data);
      console.log("Default Plugins Inserted");
    } else {
      await __Plugin.insertMany(filtered);
      console.log("Default Plugins updated");
    }

  }
}
