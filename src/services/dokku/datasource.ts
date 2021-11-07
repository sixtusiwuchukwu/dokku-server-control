import Base from "../../../base";
import {NodeSSH} from "node-ssh";
import fs, {readFileSync} from "fs";
import * as mongoose from "mongoose";

import {Client} from 'ssh2'
import path from "path";

class DokkuDatasource extends Base {
  startDokkuApp(data: { serverId: mongoose.ObjectId }) {
    const conn = new Client();
    conn.on('ready', () => {
      console.log('Client :: ready');
      conn.exec('uptime', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code: string, signal: string) => {
          console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
          conn.end();
        }).on('data', (data: string) => {
          console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
          console.log('STDERR: ' + data);
        });
      });
    }).connect({
      host: 'ec2-54-211-206-26.compute-1.amazonaws.com',
      port: 22,
      username: 'ubuntu',
      privateKey: readFileSync(path.join('deeptech.pem'))
      // privateKey: readFileSync(path.join(homedir, '.ssh','id_rsa'))
    });
  }
}

export default DokkuDatasource
