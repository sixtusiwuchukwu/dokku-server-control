const User = require("../../models/user/index");

class Userdatasource {
  async joinGroup(data) {
    const newUser = await User.create(data);
    return newUser;
  }
}

module.exports = Userdatasource;
