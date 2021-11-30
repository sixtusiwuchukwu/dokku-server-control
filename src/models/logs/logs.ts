import {Schema,model} from "mongoose"
import {Logs}  from "../../interfaces/databaseInterface/mongo"

const LogSchema = new Schema<Logs>({
  serviceName:{
    type:String,
    required:true
  },
  user:{
    type:Schema.Types.ObjectId
  },
  ip:{
    type:String,
  }
},{timestamps:true})

export default model<Logs>("logs",LogSchema)