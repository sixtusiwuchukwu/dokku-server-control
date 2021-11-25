import {Schema} from "mongoose";
import {GroupMember} from "../../interfaces/databaseInterface/mongo";

const members = new Schema<GroupMember>({
  permission:[{
    type:String,
    trim:true
  }],
  // member: Schema.Types.ObjectId
  email:{
    type:String,
    trim:true
  }
})

export default members
