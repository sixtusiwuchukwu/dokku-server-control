import {model, Schema} from 'mongoose'
import {IUser} from "../../interfaces/databaseInterface/mongo";
import {randomBytes, scryptSync} from "crypto";

const UserSchema = new Schema<IUser>({
    password: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
      unique:true
    },
    code: {
        required: true,
        type: String,
        unique: true,
        index: true
    },
    person: {
        type: Schema.Types.ObjectId,
        ref: 'person'
    }
}, {
    timestamps: true
});
UserSchema.statics.comparePassword = async (storedPassword: string, userPassword: string) => {
    const [key, salt] = storedPassword.split(":")
    const userPass: string = scryptSync(userPassword, salt, 32).toString("hex")
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
