import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ProjectMember } from "../models/projectmember.models.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";



  
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", ""); // space important

  if (!token) {
    throw new ApiError(401, "Unauthorized Request");
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select(
      "-password -forgotPasswordToken -emailVerificationToken -emailVerificationTokenExpiry"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Token Access");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid Access Token");
  }
});


export const validateProjectPermission = (roles = []) => ayncHandler(async (req, res, next) => {
   const {projectId} = req.params;

   if(!projectId)
   {
    throw new ApiError(400,"Project Id is missing");
   }


const project = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user:new moongose.Types.ObjectId(req.user._id),
     });



     
   if(!project)
   {
    throw new ApiError(400,"Project Id is missing");
   }

   const givenRole = project?.role;

   req.user.role=givenRole;

  if(!roles.includes(givenRole))
  {
        throw new ApiError(400,"Permission is missing");

  }

   
    next();



  });