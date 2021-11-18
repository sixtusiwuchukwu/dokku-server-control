import {Schema, model, plugin} from 'mongoose'
import {IServers} from "../../interfaces/databaseInterface/mongo";
const mongoosePaginate = require( 'mongoose-paginate-v2' );

const ServesSchema = new Schema<IServers>({
  username: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    required: true
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
plugin( mongoosePaginate )
export default model<IServers>("server", ServesSchema);
