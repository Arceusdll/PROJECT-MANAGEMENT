import mongoose ,{Schema} from "mongoose";
import {AvailableRoles,UserRolesEnum} from "../utils/constants.js"


const ProjectmemberSchema = new Schema({
 
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    project:{
          type:Schema.Types.ObjectId,
        ref:"Project",
        required:true,
    },
    role:{
         type:Schema.Types.ObjectId,
        ref:"AvailableRoles",
        default:UserRolesEnum.Member
    }

},{timestamps:true})

export const ProjectMember = mongoose.model("ProjectMember",ProjectmemberSchema);