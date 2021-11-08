import Base from "../../../base";
import Server from '../../models/servers/servers'
import * as mongoose from "mongoose";
import { UserInputError, ValidationError } from "apollo-server-express";
import {IServers} from "../../interfaces/datebaseInterface/mongo";

class DokkuAppControl extends Base {
  async startDokkuApp({ serverId, appName }:{serverId: mongoose.ObjectId, appName:string}) {
    const server = await Server.findById(serverId)
    if(!server) throw new ValidationError('unable to validate  server')
    const {host,port,pkey,username}: IServers = server
    const ssh:any = await this.RemoteServer(host, username, pkey, port)
    const res = await ssh.execCommand(`dokku ps:start ${appName}`, { cwd:'' })
    if(res.stderr !== "") throw new UserInputError(`Error: ${res.stderr}`)
    return `${res.stdout} server started`;
  }
}

export default DokkuAppControl

// const conn = new Client();
// conn.on('ready', () => {
//   console.log('Client :: ready');
//   conn.exec('uptime', (err, stream) => {
//     if (err) throw err;
//     stream.on('close', (code: string, signal: string) => {
//       console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
//       conn.end();
//     }).on('data', (data: string) => {
//       console.log('STDOUT: ' + data);
//     }).stderr.on('data', (data) => {
//       console.log('STDERR: ' + data);
//     });
//   });
// }).connect({
//   host: '165.22.179.46',
//   port: 22,
//   username: 'root',
//   privateKey: readFileSync(path.join(process.cwd(),'deeptech.pem'))
//   // privateKey: readFileSync(path.join(homedir, '.ssh','id_rsa'))
// });
