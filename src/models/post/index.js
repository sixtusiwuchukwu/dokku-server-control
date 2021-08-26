const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("posts", PostSchema);
