import {Config} from "node-ssh";
const { NodeSSH } = require("node-ssh");
const ids = require('short-id');
import { Model } from 'mongoose';
// const
class Base {
  constructor(params:any) {
   if(!params) throw new Error('Permissions for operations not defined kindly')

  }
  RemoteServer(host: string, username: string, pkey: string, port: number):Promise<void> {
    const ssh:Config = new NodeSSH();
    return ssh.connect({
      host,
      username,
      port,
      privateKey: pkey,
    });
  }
  async getCodeNumber(name: string, model: Model<any>, objectName: string) {
    let code;
    let codeCheck;
    do {
      code = ids.generate();
      codeCheck = await model.findOne({[objectName]: `${name}${code}`});
    }
    while (codeCheck);
    return `${name}${code}`;
  }
}
module.exports = Base;
