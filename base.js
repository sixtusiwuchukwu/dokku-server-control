const { NodeSSH } = require("node-ssh");
const fs = require("fs");
const path = require("path");

class Base {
  RemoteServer(host = "", username = "", pkey = "") {
     const ssh = new NodeSSH();
    return ssh.connect({
      host,
      username,
      privateKey: pkey,
    });
  }
}
module.exports = Base;
