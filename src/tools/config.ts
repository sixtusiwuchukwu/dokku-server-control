require('dotenv').config()
const {MONGO_URL, NODE_ENV, DOKKU_MONGO_AQUA_URL, defaultAdminAccount, MAIL_HOST,MAIL_PORT, MAIL_PASS, MAIL_USER} = process.env
const isDev = NODE_ENV === "development"
const cookieOptions = {
  // maxAge: 3.154e+10,
  domain: isDev ? 'localhost' : '.dspms.net',
  httpOnly: true
}
export {
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
