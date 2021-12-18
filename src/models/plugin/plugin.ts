import {model,Schema} from "mongoose"
import {PluginsInterface} from "../../interfaces/databaseInterface/mongo";

const PluginSchema =  new Schema<PluginsInterface>({
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

export default  model<PluginsInterface>("plugin",PluginSchema)