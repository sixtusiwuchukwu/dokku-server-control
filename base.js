const { NodeSSH } = require("node-ssh");
const fs = require("fs");
const path = require("path");

class Base {
  RemoteServer(host = "", username = "", pkey = "", port= Number(22)) {
     const ssh = new NodeSSH();
    return ssh.connect({
      host,
      username,
      port,
      privateKey: pkey,
    });
  }
}
module.exports = Base;
