import mongoose, { Schema } from "mongoose"
import { User } from "../models/user.models.js"

const ProjectSchema = new Schema ({
       name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
       },
       description:{
        type:String,
       },
       createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
       }

     
},


{timestamps:true}
);

export const Project = mongoose.model("Project",ProjectSchema);