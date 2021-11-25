import {model, Schema} from 'mongoose'
import {Person} from "../../interfaces/databaseInterface/mongo";

const PersonUser = new Schema<Person>({
    phone:{
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: true,
        toLowerCase:true
    },
    lastName:{
        type: String,
        required: true,
        toLowerCase:true
    },
    address:[ {
      type: Object,
      required: true,
      trim: true,
      toLowerCase:true
    }],
    permissions: {
        type: []
    },
    // permissionListType: {
    //   enum:['white', 'black'],
    //   type:String,
    //   required: true,
    // },
    isBlocked: {
        type: Boolean,
        default: false,
        index: true
    },
    user:{
        type:Schema.Types.ObjectId,
        index: true,
        required: true
    }

},{
    timestamps:true
})

export default model<Person>("person",PersonUser)
