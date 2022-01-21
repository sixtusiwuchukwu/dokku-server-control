import * as fs from "fs";
const  ejs = require("ejs")
const { NodeSSH } = require("node-ssh");
const ids = require('short-id');
import dns from 'dns/promises'
import {Model, ObjectId} from 'mongoose';
import nodemailer from 'nodemailer'
import {UserInputError} from "apollo-server-express";
import {isDev, MAIL_HOST, MAIL_PASS, MAIL_PORT, MAIL_USER} from "./src/tools/config";
import __Log from "./src/models/logs/logs"
import * as path from "path";
import Validation from "./src/Validations/Validations";

class Base extends Validation{
  async lookUp(host: string) {
    try {
      return await dns.lookup(host)
    } catch (e: any) {
      throw new UserInputError('unable to resolve address')
    }
  }

   sendMailConfig() {
    const mailConfig = {
       host: MAIL_HOST,
         port: MAIL_PORT,
         auth: {
         user: MAIL_USER,
           pass: MAIL_PASS
       }
     };
    return nodemailer.createTransport(mailConfig as object);
  }

   getTemplate(templateName: string, data:object) {
    const selection: { invoice: string; activation: string; welcome: string } = {
      welcome: templateName === "welcome" && fs.readFileSync(  path.join(process.cwd() ,"src","utils","emailTemplate","welcome.ejs") ).toString(),
      activation : templateName === "activation" && fs.readFileSync( path.join(process.cwd(),"src","utils","emailTemplate","activation.ejs")  ).toString(),
      invoice : templateName === "invoice" && fs.readFileSync(path.join(process.cwd(),"src","utils","emailTemplate","invoice.ejs")).toString(),
<<<<<<< HEAD
=======
      resetPassword : templateName === "resetPassword" && fs.readFileSync(path.join(process.cwd(),"src","utils","emailTemplate","resetPassword.ejs")).toString(),
      updatePassword : templateName === "updatePassword" && fs.readFileSync(path.join(process.cwd(),"src","utils","emailTemplate","updatePassword.ejs")).toString(),
>>>>>>> 55c199482e0ee2aab6affa4984b6fdb1f8d7bf3b
    }
    if (!Object.keys(selection).includes(templateName)) throw new Error(`Unknown email template type expected one of ${JSON.stringify(Object.keys(selection))} but got ${templateName}`);
    let template = ejs.compile((selection[templateName as keyof typeof selection]), {});
    return template(data)
  }


   sendMail(to: string, subject: string, TemplateName: string, data?: any, from?:string) {
    const info = {
      from: from ? from :  '"DSPMS" <no-reply@dspms.net>',
      to,
      subject: subject.toUpperCase(),
      html: this.getTemplate(TemplateName.toLowerCase(), data),
    };

     this.sendMailConfig().sendMail(info).then(info => {
      console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
    }).catch((e)=>{
       console.error(e,`Error ending email to ${to}`)
     });
  }

  RemoteServer(host: string, username: string, pkey: string, port: number = 22): Promise<void> {
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

  async Log({serviceName, user, ip = ""}: { serviceName: string, user: ObjectId, ip?: string }) {
    await __Log.create({serviceName, user, ip})
   return
  }

}

export default Base;
