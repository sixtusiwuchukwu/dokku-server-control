import {Schema, model, plugin} from 'mongoose'
import {IServers} from "../../interfaces/databaseInterface/mongo";
import mongoosePaginate from  "mongoose-paginate-v2" ;
import serverMembers from "../../models/reusableSchema/members"

const ServesSchema = new Schema<IServers>({
  username: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    index:true
  },
  port: {
    type: Number,
    required: true
  },
  host: {
    type: String,
    required: true,
  },
  serverName: {
    type: String,
    required: true,
    unique:true,
    trim:true,
    toLowerCase:true
  },
  members:{
    type:[serverMembers]
  },
  pkey: {
    type: String,
    required: true
  },
  groupId:{
    type:Schema.Types.ObjectId
  }
}, {
  timestamps: true
});
plugin( mongoosePaginate )
export default model<IServers>("server", ServesSchema);
