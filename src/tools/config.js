const {MONGO_URL, NODE_ENV, DOKKU_MONGO_AQUA_URL} = process.env
const isDev = NODE_ENV === "development"
module.exports = {
  isDev,
  MONGO_URL,
  DOKKU_MONGO_AQUA_URL
}
