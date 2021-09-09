const mongoose = require("mongoose");
const mongoosePaginate = require( 'mongoose-paginate-v2' );
const ServesSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  port: {
    type: Number,
    required: true
  },
  host: {
    type: String,
    required: true,
  },
  ServerName: {
    type: String,
    required: true
  },
  pkey: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
mongoose.plugin( mongoosePaginate )
module.exports = mongoose.model("server", ServesSchema);
