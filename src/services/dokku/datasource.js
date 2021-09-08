const fs = require("fs");
const path = require("path");
const { NodeSSH } = require("node-ssh");

const ssh = new NodeSSH();

ssh
  .connect({
    host: "localhost",
    username: "steel",
    privateKey: fs.readFileSync("/home/steel/.ssh/id_rsa", "utf8"),
  })
  .then(function () {
    ssh
      .putFile(
        "/home/dokku/Lab/localPath/fileName",
        "/home/dokku/Lab/remotePath/fileName"
      )
      .then(
        function () {
          console.log("done");
        },
        function (error) {
          console.log("Something's wrong");
          console.log(error);
        }
      );
  });
