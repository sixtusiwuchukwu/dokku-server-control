import {Schema,model} from "mongoose"
import {Logs}  from "../../interfaces/databaseInterface/mongo"

const LogSchema = new Schema<Logs>({
  serviceName:{
    type:String,
    required:true,
    index:true
  },
  user:{
    type:Schema.Types.ObjectId,
    index:true
  },
  ip:{
    type:String,
  }
},{timestamps:true})

export default model<Logs>("logs",LogSchema)