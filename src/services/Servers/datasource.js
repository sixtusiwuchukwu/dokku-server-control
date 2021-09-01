const __Server = require("../../models/servers/servers");
const {UserInputError} = require('apollo-server-express')
const Base = require('../../../base')
class ServerDatasource extends Base{
  async listServers({search, page}) {
    const query = {};
    if ( search ) {
      query[ 'serverName' ] = { $regex : search , $options : 'ig' }
    }
    const options = {
      page : page ,
      limit : 5 ,
      projection: {pkey: 0, username: 0},
      sort : { createdAt : -1 } ,
      collation : {
        locale : 'en'
      }
    };
  
    return await __Server.paginate( {...query} , options )
  }
  async addServer(data) {
    try {
      const {username, host, pkey} = data
      await this.RemoteServer(host, username, pkey)
      await __Server.create(data)
      return "New server Added"
    }
    catch (e) {
      if(e.message.includes('authentication methods failed')) {
        throw new UserInputError(`Cannot verify server credentials for ${data.host}`)
      }
      if (e.name === "Error" || e.name === "TypeError"|| e.name === "ReferenceError") {
        console.log(e);
        throw new UserInputError("Unable to complete server setup contact support");
      }
      throw new UserInputError(e.message);
    }
  }
}

module.exports = ServerDatasource;
