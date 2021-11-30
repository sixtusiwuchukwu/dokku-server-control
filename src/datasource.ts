import ServerControl from './services/servers/datasource'
import GroupControl from './services/group/datasource'
import User from './services/user/datasource';
import DokkuAppControl from './services/dokku/datasource';
import LogControl from './services/logs/datasource';
export default {
  ServerControl,
  GroupControl,
  User,
  DokkuAppControl,
  LogControl
};
