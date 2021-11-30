const ejs = require( 'ejs' );
const fs = require( 'fs' );
const {NodeSSH} = require("node-ssh");
const ids = require('short-id');
import dns from 'dns/promises'
import {Model} from 'mongoose';
import nodemailer from 'nodemailer'
import {UserInputError} from "apollo-server-express";
import {isDev, MAIL_HOST, MAIL_PASS, MAIL_PORT, MAIL_USER} from "./src/tools/config";
import {WelcomeTemplate} from "./src/utils/emailTemplate/welcome"
import path from "path";

class Base {
  async lookUp(host: string) {
    try {
      return await dns.lookup(host)
    } catch (e: any) {
      throw new UserInputError('unable to resolve address')
    }
  }

  async sendMailConfig() {
    let mailConfig;
    if (!isDev) {
      // all emails are delivered to destination

      mailConfig = {
        // @ts-ignore
        host: MAIL_HOST,
        port: MAIL_PORT,
        auth: {
          user: MAIL_USER,
          pass: MAIL_PASS
        }
      };
    } else {
      // all emails are catched by ethereal.email
      mailConfig = {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'dan.treutel1@ethereal.email',
          pass: 'wC4wacY3unRpPPxaCB'
        }
      };
    }
    return nodemailer.createTransport(mailConfig);
  }

  async getTemplate(templateName: string) {
    const selection: any = {
      welcome: WelcomeTemplate,
    };
    const acceptedType = ["welcome"];
    if (!acceptedType.includes(templateName)) throw new Error(`Unknown email template type expected one of ${acceptedType} but got ${templateName}`);
    return selection[templateName]

    // const selection = {
    //   activation : fs.readFileSync( path.join( process.cwd() , '/src/tools/emailTemplate/activation.ejs' ) ).toString(),
    //   invoice : fs.readFileSync( path.join( process.cwd() , '/src/tools/emailTemplate/invoice.ejs' ) ).toString(),
    //   "alart_trasaction" : fs.readFileSync( path.join( process.cwd() , '/src/tools/emailTemplate/alart_trasaction.ejs' ) ).toString(),
    // };
    // const acceptedType = [ "activation" , "transaction" , "invoice" , "forgotPassword", "support", "alart_trasaction" ];
    // if ( !acceptedType.includes( template ) ) throw new Error( `Unknown email template type expected one of ${ acceptedType } but got ${ template }` );
    // return  ejs.compile( selection[ template ] , opts || {} )( data );
  }


  async sendMail(from: string, to: string, subject: string, TemplateName: string, option: any) {

    const template = this.getTemplate(TemplateName.toLowerCase())

    const info = {
      from,
      to,
      subject: subject.toUpperCase(),
      html: (await template)(option),
    };

    (await this.sendMailConfig()).sendMail(info).then(info => {
      console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
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
}

export default Base;
