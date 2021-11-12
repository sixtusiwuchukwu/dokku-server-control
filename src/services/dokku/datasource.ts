import Base from "../../../base";
import Server from '../../models/servers/servers'
import * as mongoose from "mongoose";
import { UserInputError, ValidationError } from "apollo-server-express";
import {IServers} from "../../interfaces/datebaseInterface/mongo";

class DokkuAppControl extends Base {
  async createDokkuApp({ serverId, appName }:{serverId: mongoose.ObjectId, appName:string}) {
    const server = await Server.findById(serverId)
    if(!server) throw new ValidationError('unable to validate  server')
    const {host,port,pkey,username}: IServers = server
    const ssh:any = await this.RemoteServer(host, username, pkey, port)
    const res =  ssh.execCommand(`dokku ps:create ${appName}`, { cwd:'' })
    if(res.stderr !== "") throw new UserInputError(`Error: ${res.stderr}`)
    return `${res.stdout} server started`;
  }
  async startDokkuApp({ serverId, appName }:{serverId: mongoose.ObjectId, appName:string}) {
    const server = await Server.findById(serverId)
    if(!server) throw new ValidationError('unable to validate  server')
    const {host,port,pkey,username}: IServers = server
    const ssh:any = await this.RemoteServer(host, username, pkey, port)
    const res =  ssh.execCommand(`dokku ps:start ${appName}`, { cwd:'' })
    if(res.stderr !== "") throw new UserInputError(`Error: ${res.stderr}`)
    return `${res.stdout} server started`;
  }
  async stopDokkuApp({ serverId, appName }:{serverId: mongoose.ObjectId, appName:string}) {
   const server = await Server.findById(serverId);
    if(!server) throw new ValidationError('unable to validate  server')
    const {host,port,pkey,username}: IServers = server
    const ssh:any = await this.RemoteServer(host, username, pkey, port)
    const res =  ssh.execCommand(`dokku ps:stop ${appName}`, { cwd:'' })
    if(res.stderr !== "") throw new UserInputError(`Error: ${res.stderr}`)
    return `${res.stdout} server stopped`;
  }
  async stopAllDokkuApp({ serverId,}:{serverId: mongoose.ObjectId}) {
   const server = await Server.findById(serverId);
    if(!server) throw new ValidationError('unable to validate  server')
    const {host,port,pkey,username}: IServers = server
    const ssh:any = await this.RemoteServer(host, username, pkey, port)
    const res = ssh.execCommand(`dokku ps:stop --all`, { cwd:'' })
    if(res.stderr !== "") throw new UserInputError(`Error: ${res.stderr}`)
    return `${res.stdout} servers stopped`;
  }

  async reStartPolicy({ serverId,appName,policy}:{serverId: mongoose.ObjectId, policy:string,appName:string}) {
   const server = await Server.findById(serverId);
    if(!server) throw new ValidationError('unable to validate  server')
    const {host,port,pkey,username}: IServers = server
    const ssh:any = await this.RemoteServer(host, username, pkey, port)
    const res = ssh.execCommand(`dokku ps:set ${appName} restart-policy ${policy}`, {cwd: ''})
    if(res.stderr !== "") throw new UserInputError(`Error: ${res.stderr}`)
    return `${res.stdout} set reStartPolicy ${policy}`;
  }

  async dokkuAppReport({ serverId,appName,select}:{serverId: mongoose.ObjectId,appName:string,select:string}) {
   const server = await Server.findById(serverId);
    if(!server) throw new ValidationError('unable to validate  server')
    const {host,port,pkey,username}: IServers = server
    const ssh:any = await this.RemoteServer(host, username, pkey, port)
    const res = ssh.execCommand(`dokku ps:report ${appName} ${select}`, {cwd: ''})
    if(res.stderr !== "") throw new UserInputError(`Error: ${res.stderr}`)
    return `${res.stdout} ${appName}:Report`;
  }

  async reBuildDokkuApp({ serverId,appName}:{serverId: mongoose.ObjectId,appName:string}) {
   const server = await Server.findById(serverId);
   const option = appName ? appName : "--all"
    if(!server) throw new ValidationError('unable to validate  server')
    const {host,port,pkey,username}: IServers = server
    const ssh:any = await this.RemoteServer(host, username, pkey, port)
    const res = ssh.execCommand(`dokku ps:rebuild ${option}`, {cwd: ''})
    if(res.stderr !== "") throw new UserInputError(`Error: ${res.stderr}`)
    return `${res.stdout} dokkuApp rebuild`;
  }
  async reStartDokkuApp({ serverId,appName}:{serverId: mongoose.ObjectId,appName:string}) {
   const server = await Server.findById(serverId);
    if(!server) throw new ValidationError('unable to validate  server')
    const {host,port,pkey,username}: IServers = server
    const ssh:any = await this.RemoteServer(host, username, pkey, port)
    const res = ssh.execCommand(`dokku ps:restart ${appName}`, {cwd: ''})
    if(res.stderr !== "") throw new UserInputError(`Error: ${res.stderr}`)
    return `${res.stdout} dokku app Restarted`;
  }

  async reStartAllDokkuApp({ serverId,parallel,flag}:{serverId: mongoose.ObjectId,parallel:Boolean,flag:Number}) {
   const server = await Server.findById(serverId);
   let option = parallel === true && flag ? `--parallel ${flag}` : ""
    if(!server) throw new ValidationError('unable to validate  server')
    const {host,port,pkey,username}: IServers = server
    const ssh:any = await this.RemoteServer(host, username, pkey, port)
    const res = ssh.execCommand(`dokku ps:restart --all ${option}`, {cwd: ''})
    if(res.stderr !== "") throw new UserInputError(`Error: ${res.stderr}`)
    return `${res.stdout} dokku apps Restarted`;
  }
  async reNameDokkuApp({ serverId,currentName,newName,skipDeploy}:{serverId: mongoose.ObjectId,currentName:String,newName:Number,skipDeploy:Boolean}) {
   const server = await Server.findById(serverId);
   const flag = skipDeploy === true ? "--skip-deploy" : ""
    if(!server) throw new ValidationError('unable to validate  server')
    const {host,port,pkey,username}: IServers = server
    const ssh:any = await this.RemoteServer(host, username, pkey, port)
    const res = ssh.execCommand(`dokku apps:rename ${flag} ${currentName} ${newName}`, {cwd: ''})
    if(res.stderr !== "") throw new UserInputError(`Error: ${res.stderr}`)
    return `${res.stdout} dokku app Renamed`;
  }
  async dokkuInstallPlugin({ serverId,pluginName}:{serverId: mongoose.ObjectId,pluginName:String}) {
   const server = await Server.findById(serverId);
    if(!server) throw new ValidationError('unable to validate  server')
    const {host,port,pkey,username}: IServers = server
    const ssh:any = await this.RemoteServer(host, username, pkey, port)
    const res = ssh.execCommand(`sudo dokku plugin:install ${pluginName}`, {cwd: ''})
    if(res.stderr !== "") throw new UserInputError(`Error: ${res.stderr}`)
    return `${res.stdout} plugin installed`;
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
