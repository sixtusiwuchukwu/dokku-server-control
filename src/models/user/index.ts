import {model, Schema} from 'mongoose'
import {IUser} from "../../interfaces/datebaseInterface/mongo";
import {randomBytes, scryptSync} from "crypto";

const UserSchema = new Schema<IUser>({
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
  phone:{
    type: String,
    required: true
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
  lastReset: {
    type: String,
    default: Date.now(),
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
  password: {
    required: true,
    type: String
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
UserSchema.statics.comparePassword = async (storedPassword:string, userPassword:string) => {
  const [key, salt] = storedPassword.split(":")
   const userPass:string = scryptSync(userPassword, salt, 32).toString("hex")
   return userPass === key
};

UserSchema.pre('save', function saveHook(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  const salt = randomBytes(16).toString("hex")
  user.password = `${scryptSync(user.password, salt, 32).toString("hex")}:${salt}`
  return next();
});
export default model<IUser>("users", UserSchema);
