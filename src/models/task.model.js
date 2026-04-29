import mongoose,{Schema} from "mongoose";
import {AvailableTaskStatus,TaskStatusEnum} from "../utils/constants.js";


const TaskSchema = new Schema ({

  title:{
    type:String,
    trim:true,
    required:true
  },
  description:String,
 project:{
    type:Schema.Types.ObjectId,
    ref:"Project",
    required:true,
 },
 assignedTo:{
   type:Schema.Types.ObjectId,
   ref:"User",
 },
  assignedBy:{
   type:Schema.Types.ObjectId,
   ref:"User",
 },
 status:{
    type:String,
    enum:AvailableTaskStatus,
    default:TaskStatusEnum.TODO
 },
 attachment:
 {
    type:[{
        url:String,
        mimitype:String,
        size:Number
    }],
    default :[]
 }


},{timestamps:true});



export const Tasks = mongoose.model("TaskSchema",TaskSchema);

