const {MONGO_URL, NODE_ENV, DOKKU_MONGO_AQUA_URL, defaultAdminAccount} = process.env
const isDev = NODE_ENV === "development"
const cookieOptions = {
  maxAge: 3.154e+10,
  httpOnly: true
}
export {
  isDev,
  cookieOptions,
  defaultAdminAccount,
  MONGO_URL,
  DOKKU_MONGO_AQUA_URL
}
