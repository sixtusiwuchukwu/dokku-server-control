const { NodeSSH } = require("node-ssh");
const ids = require('short-id');
import dns from 'dns/promises'
import { Model } from 'mongoose';
import {UserInputError} from "apollo-server-express";
// const
class Base {
  async lookUp(host:string){
    try {
     return await dns.lookup(host)
    }
    catch (e:any){
      throw new UserInputError('unable to resolve address')
    }
  }
  RemoteServer(host: string, username: string, pkey: string, port: number = 22):Promise<void> {
    const ssh = new NodeSSH();
    return ssh.connect({
      host,
      username,
      port,
      privateKey: pkey,
    });
  }
  async getCodeNumber(name: string, model: Model<any>, objectName: string = "code") {
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
export default Base;
