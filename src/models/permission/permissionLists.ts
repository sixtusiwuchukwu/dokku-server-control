import {model, Schema} from "mongoose"
import {PermissionInterface} from "../../interfaces/databaseInterface/mongo";

const PermissionLists = new Schema<PermissionInterface>({

  permission: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index:true
  }

}, {
  timestamps: true
})

export default model<PermissionInterface>("allPermission", PermissionLists)
