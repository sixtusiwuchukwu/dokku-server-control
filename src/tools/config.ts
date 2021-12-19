require('dotenv').config()
export const {MONGO_URL, NODE_ENV, DOKKU_MONGO_AQUA_URL, defaultAdminAccount, MAIL_HOST,MAIL_PORT, MAIL_PASS, MAIL_USER} = process.env
export const isDev = NODE_ENV === "development"
export const cookieOptions = {
  // maxAge: 3.154e+10,
  domain: isDev ? 'localhost' : '.dspms.net',
  httpOnly: true
}
const envs = {
  isDev,
  cookieOptions,
  MAIL_HOST,
  MAIL_PASS,
  MAIL_PORT,
  MAIL_USER,
  defaultAdminAccount,
  MONGO_URL,
  DOKKU_MONGO_AQUA_URL
}
const list = Object.keys(envs)
const errors = []
for (let i = 0; i < list.length; i++) {
  // @ts-ignore
  if(envs[list[i]] === undefined) {
    // @ts-ignore
    errors.push({[list[i]]:envs[list[i]]})
  }
}
if(errors.length > 0) {
  const message = `ENV Error, the following ENV are not set:`
  console.error(message, errors)
  throw new Error("Fix Env and rebuild")
}
