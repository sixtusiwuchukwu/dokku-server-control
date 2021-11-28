import {model, Schema} from "mongoose"

const PermissionLists = new Schema<string[]>({

  permission: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }

}, {
  timestamps: true
})

export default model<string[]>("allPermission", PermissionLists)
