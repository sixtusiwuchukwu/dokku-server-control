import {model, Schema} from "mongoose"
import {permissionInterface} from "../../interfaces/databaseInterface/mongo";

const PermissionLists = new Schema<permissionInterface>({

  permission: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }

}, {
  timestamps: true
})

export default model<permissionInterface>("allPermission", PermissionLists)
