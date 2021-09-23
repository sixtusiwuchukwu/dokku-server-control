import {Schema, model} from 'mongoose'
enum accountType {
  admin,
  user
}
interface User {
  username:string
  code:string
  email:string
  firstName: string
  lastName: string
  permissions: Array<string>
  blackListCommands: Array<string>
  whiteListCommands: Array<string>
  isBlocked: boolean
  allowedRoutes: Array<string>
  accountType: accountType
  createdAt: Date
  updatedAt: Date
}
const UserSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
    index: true
  },
  code:{
    required: true,
    type: String,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    index: true
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true
  },
  permissions: {
    type: []
  },
  blackListCommands: {
    type: []
  },
  whiteListCommands: {
    type: []
  },
  isBlocked: {
    type: Boolean,
    default: false,
    index: true
  },
  allowedRoutes: {
    type: [],
    default: ['/']
  },
  accountType: {
    type: String,
    required: true,
    index:true,
    enum: ['admin','user']
  }

}, {
  timestamps: true
});

module.exports = model<User>("users", UserSchema);
