    import { User } from "../models/user.models.js";
    import{ Project } from "../models/project.models.js";
    import { ProjectMember } from "../models/projectmember.models.js";
    import ApiResponse from "../utils/api-response.js";
    import { asyncHandler } from "../utils/async-handler.js";
    import {ApiError} from "../utils/api-error.js";
    import{EmailVerificationContent, sendEmail,EmailPasswordResetContent} from "../utils/mail.js";
    import mongoose from "mongoose";
import { AvailableRoles, UserRolesEnum } from "../utils/constants.js";

  const getProject = asyncHandler (async(req,res) => {
    const projects = await ProjectMember.aggregate ([
      {
        $match:{
          user:new mongoose.Types.ObjectId(req.user._id),

        },
        $lookup:  
        {
          from:"projects",
          localField:"projects",
          foreignField:"_id",
          as:"projects",
          pipeline:[
            {
              $lookup:{
                from:"projects",
                localField:"_id",
                foreignField:"projects",
                as:"projectmembers"
              },
            },
            {
            $addFields: {
              members:{
                $size:"$projectmembers"
              }
            }
            }
          
          ]
        }
      },
      {
        $unwind:"$project"
      },
      {
        $project:{
          project:{
            _id:1,
            name:1,
            description:1,
            memebers:1,
            createdAt:1,
            createdBy:1,
          },
          role:1,
          _id:0,
        }
      }
    ]);
    return res.status(200)
    .json(
      new ApiResponse(
        200,
        project,
        "Projects fetched Successfully"
      )
    )
  });

    const updateProject = asyncHandler (async(req,res) => {
        const {name,description}=req.body;
        const{projectId} = req.params;

      const project =  await Project.findByIdAndUpdate({
            name,
            description,
        },{
            new:true
        })

        if(!project)
        {
            throw new ApiError(401,"No such Project Found ");
        }
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            project,
            "Project Updated Successfully"
        ))

  });

    const deleteProject = asyncHandler (async(req,res) => {
      const {projectId} = req.params;

    

      if(!projectId)
      {
        throw new ApiError(400,"No such Project found to be deleted");
      }

      await Project.findByIdAndDelete(projectId);

       return res
        .status(200)
        .json(new ApiResponse(
            200,
             {},
            "Project Deleted Successfully"
        ))


  });

    const addMembersToProject = asyncHandler (async(req,res) => {
      const {email,role}= req.body;
      const{projectId} = req.params;

      const user = await User.findOne({email});
        if(!user){
          throw new ApiError("No user found ");
        }

      // const project = await Project.findById(projectId);
      // if(!project){
      //   throw new ApiError(404,"No such Project is found");
      
      // }
      await ProjectMember.findByIdAndUpdate(
      {
        new:new mongoose.Types.ObjectId(user._id),
        project:new moongose.Types.ObjectId(projectId),
      },
      {
          new:new mongoose.Types.ObjectId(user._id),
        project:new moongose.Types.ObjectId(projectId),
        role:role,
      },{
        new:true,
        upsert:true,
      }
    
    );
         return res.status(200).
         json(new ApiResponse(200,{},"Project members added successfully"));





  });

    const getPRojectMember = asyncHandler (async(req,res) => {
    const{projectId} = req.params;
    const project = await Project.findById(projectId) ;

    if(!project)
    {
      throw new ApiError(404,"No such project found");
    }
   
    const projectMembers = await ProjectMember.aggregate([
      {
        $match:{
          project:new moongose.Types.ObjectId(projectId),
        },
        $lookup:{
          from:"user",
          localField:"user",
          foreignField:"_id",
          as:"user",
          pipeline :[
            {
              $project:{
                _id:1,
                username:1,
                fullName:1,
                avatar:1,


              }
            }
          ]
        },
        
      },{
        $addFields:{
          user:{
            $arrayElemAt:["user",0]
          }
        }
      }.{
        $project:{
          project:1,
          user:1,
          role:1,
          createdAt:1,
          updatedAt:1,
          _id:0
        }
      }
    ]);
    return res.
    status(200).
    json(new ApiResponse (
      200,
      projectMembers,
      "Members fetched succesfully"
    ))

  });

    const updateMmeberROle = asyncHandler (async(req,res) => {
     const {projectId,userId} = req.params;
     const{newRole}= req.body;
      

     if(!AvailableRoles.includes(newRole))
     {
      throw new ApiError(404,"Invalid Role");
     }


     let projectMember = await ProjectMember.findOne({
          projet:new moongose.Types.ObjectId(projectId),
          user:new moongose.Types.ObjectId(userId)
     });

 if(!projectMember)
     {
      throw new ApiError(404," Member Not Found");
     }

     await ProjectMember.findByIdAndUpdate(
      projectMember._id,{
        role:newRole,
      },{
        new:true
      }
     )


     return res
     .status(200)
     .json(
      new ApiResponse(
        200,
        {},
        "Project Member Role Update successfully"
      )
     )

  });

    const deleteMember = asyncHandler (async(req,res) => {
  const {projectId,userId} = req.params;
    
      

  

     let projectMember = await ProjectMember.findOne({
          projet:new moongose.Types.ObjectId(projectId),
          user:new moongose.Types.ObjectId(userId)
     });

 if(!projectMember)
     {
      throw new ApiError(404," Member Not Found");
     }

     await ProjectMember.findByIdAndDelete(projectMember._id
     );
    


     return res
     .status(200)
     .json(
      new ApiResponse(
        200,
        {},
        "Project Member Deleted successfully"
      )
     )

  });

    const getProjectByID = asyncHandler (async(req,res) => {
       const {projectId} = req.params;
        const project = await Project.findById(projectId);

        if(!project){
          throw new ApiError(404,"Project not found")
        }

        return res.
        status(200).
        json(
          new ApiResponse(
            200,
            project,
            "Project founded successfully",
          ));
  });

    const createProject = asyncHandler (async(req,res) => {
    const {name,description} =req.body;

     const project = await Project.create({
        name,
        description,
        createdBy:new mongoose.Types.ObjectId(req.user._id),
     });

     await ProjectMember.create({
        user: new mongoose.Types.ObjectId(req.user._id),
        project: new mongoose.Types.ObjectId(project),
        role:UserRolesEnum.ADMIN,
     });
         return res
         .status(200)
         .json (
            new ApiResponse(
                200,
                project,
               "Project created Successfully"
            )
         );

  });


export {updateProject,updateMmeberROle,getPRojectMember,getProject,getProjectByID,addMembersToProject,deleteMember,createProject,deleteProject,}

