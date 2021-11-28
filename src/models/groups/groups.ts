import {Schema, model,} from "mongoose";
import {Group} from "../../interfaces/databaseInterface/mongo";
import groupMembers from "../../models/reusableSchema/members"


const GroupSchema = new Schema<Group>({
  name:{
    type:String,
    required:true,
    unique:true,
    index:true
  },
  members:{
    type:[groupMembers]
  },
  servers:{
    type: [Schema.Types.ObjectId]
  },
  owner:{
    type:Schema.Types.ObjectId,
    required: true,
    index: true
  }
},{timestamps:true})

export default  model<Group>("group",GroupSchema)