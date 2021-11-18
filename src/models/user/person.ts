import {model, Schema} from 'mongoose'
import {Person} from "../../interfaces/databaseInterface/mongo";

const PersonUser = new Schema<Person>({
    username: {
        type: String,
        index: true
    },
    email: {
        type: String,
        index: true,
        unique:true
    },
    phone:{
        type: String,

    },
    firstName: {
        type: String,

    },
    lastName: {
        type: String,

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
        index:true,
        enum: ['admin','user']
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    }

},{
    timestamps:true
})

export default model<Person>("person",PersonUser)