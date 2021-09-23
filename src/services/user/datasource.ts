const User = require("../../models/user");

class Userdatasource {
  async joinGroup(data:any) {
    const newUser = await User.create(data);
    return newUser;
  }
  async isLoggedIn() {

  }
}

module.exports = Userdatasource;
