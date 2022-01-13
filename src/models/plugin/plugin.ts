import {model,Schema} from "mongoose"
import {PluginInterface} from "../../interfaces/databaseInterface/mongo";

const PluginSchema =  new Schema<PluginInterface>({
    name:{
        type:String,
        trim:true,
        index:true,
        unique:true,
        required:true
    },
    url:{
        type:String,
        trim:true,
        required:true
    },
    commands:[{
        type:String,
        trim:true
    }]

})

export default  model<PluginInterface>("plugin",PluginSchema)