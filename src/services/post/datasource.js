const Post = require("../../models/post/index");

class Postdatasource {
  async addPost(data) {
    const newpost = await Post.create(data);
    return newpost;
  }

  async getPost() {
    const allPost = await Post.find();
    return allPost;
  }
}

module.exports = Postdatasource;
