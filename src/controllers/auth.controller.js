    import { User } from "../models/user.models.js";
    import{ Project } from "../models/project.models.js";
    import { ProjectMember } from "../models/projectmember.models.js";
    import ApiResponse from "../utils/api-response.js";
    import { asyncHandler } from "../utils/async-handler.js";
    import {ApiError} from "../utils/api-error.js";
    import{EmailVerificationContent, sendEmail,EmailPasswordResetContent} from "../utils/mail.js";
    import {verifyJWT} from "../middlewares/auth.middleware.js";


const generateAccessAndRefreshToken = async(userId) =>
    {
        try{
            const user = await User.findById(userId);
            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();
        
            user.refreshToken = refreshToken;
            await user.save({validateBeforeSave:false});
                return{accessToken,refreshToken}
        
        
        
        }
       catch(error){
    console.log("TOKEN ERROR:", error.message);
    throw new ApiError(500,"Error generating tokens");
     } 
     
    
     
 }

const RegisterUser = asyncHandler (async(req,res) =>{ 
    const {email,username,password,fullName} = req.body;

    const existedUser = await User.findOne({$or:[{username},{email}]});
    if(existedUser)
    {
        throw new ApiError(409,"User with this email already exists",[]);
    }

    const user = await User.create({
        email,
        password,
        username,
        fullName,
        isEmailVerified:false
    });

    const{unhasedToken,hashedToken,tokenExpiry} = user.temporaryToken();
    
    user.emailVerificationToken=hashedToken;
    user.emailVerificationExpiry=tokenExpiry;


    await user.save({validateBeforeSave:false});  
    
    await sendEmail ({
        email:user?.email,
        subject:"Please Verify Your email",
        mailgenContent:EmailVerificationContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/user/verify-email/${unhasedToken}`
        )
    })
    const createdUser = await User.findById(user._id).select(
        "-password -forgotPasswordToken -emailVerificationToken -emailVerificationTokenExpiry"
    );

    if(!createdUser)
    {
        throw new ApiError(500,"Something went wrong try again later");

    }
    return res
    .status(201)
    .json(
    new ApiResponse(200,
        {user:createdUser},
        "User registered with us and verification email has been sent ..."
    )
    );

 });

const login = asyncHandler(async(req,res)=>{
        const{email,password,username}=req.body; 

        if(!email){
            throw new ApiError(400,"Issue with your credentials... Please check ur mail")

        }
       const user = await User.findOne({email});
      
       if(!user)
       {
          throw new ApiError(400,"User not registered with us");
       }

       const IspasswordCorrect = await user.comparePassword(password);
     if(!IspasswordCorrect)
       {
          throw new ApiError(400,"Invalid Credentials");

       };

       const{accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

       const  loggedInUser = await User.findById(user._id).select(
        "-password -forgotPasswordToken -emailVerificationToken -emailVerificationTokenExpiry");

           
        const options ={
            httpOnly:true,
            secure:true
        }

        return res.
        status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
            200,
            {
               user:loggedInUser,
               accessToken:accessToken,
               refreshToken:refreshToken
            }
            )
        )
    
    
    
});
   
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: 1 },
  });

  const options = {
    httpOnly: true,
    secure: false, // change for local dev
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const getCurrentUser= asyncHandler(async(req,res)=>{
    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.user,
            "Current user fetched succesfully"
        )
    )

});

const verifyEmail=asyncHandler(async(req,res)=>{
    const {verificationToken}=req.params

    if(!verificationToken)
    {
        throw new ApiError(400,"Email Verification token is missing");

    }

    const hasedToken = crypto
    .createHash("sha256")
    .update("verificationToken")
    .digest("hex")

   const user = await User.findOne({
    emailVerificationToken :hashedToken,
    emailVerificationTokenExpiry:{$gt:Date.now()}

        });
        if(!user)
        {
            throw new ApiError(400,"TOken is invalid or expired");

        }

        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpiry = undefined;

        user.isEmailVerified = true;
        await user.save({validateBeforeSave:false});
   
        return res
        .status(200)
        .json(
            new ApiResponse (
                200,
                {
                    isEmailVerified:true,
                },
                "Email is verified",
            )
        )

});
    
const resendEmailVerification = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user?._id);

    if(!user){
        throw new ApiError(404,"User does not exist");
    }
    if(user.isEmailVerified)
    {
        throw new ApiError(409,"Email is already verified");
    }

    const{unhasedToken,hashedToken,tokenExpiry} = user.temporaryToken();
    
    user.emailVerificationToken=hashedToken;
    user.emailVerificationExpiry=tokenExpiry;


    await user.save({validateBeforeSave:false});  
    
    await sendEmail ({
        email:user?.email,
        subject:"Please Verify Your email",
        mailgenContent:EmailVerificationContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/user/verify-email/${unhasedToken}`
        )
    });
});

const refreshAccessToken = asyncHandler(async(req,res) => {
   
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken)
    {
        throw new ApiError(401,"Unauthorized Access");
    }
       
    try{
        jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id);
        if(!user)
        {
            throw new ApiError(401,"Invalid Refresh Token");
        }
         if(incomingRefreshToken !== user?.refreshToken)
         {
            throw new ApiError(401,"RefreshToken is expired");
         }

         const options = {
            httpOnly:true,
            secure:true
         }
           
         const {accessToken,refreshToken: newRefreshToken} = await generateAccessAndRefreshToken(user._id);

         user.refreshToken = newRefreshToken;
         await user.save();
         return res
         .status(200)
         .cookie("AccessToken",accessToken,options)
         .cookie("RefreshToken",newRefreshToken,options)
         .json(
            new ApiResponse(
                200,
                {
                    accessToken,refreshToken:newRefreshToken
                },"AccessToken Refreshed",
            ),
         );

       }catch(error){
           throw new ApiError(401,"Refresh Token is invalid");
       }
    


});

const forgotPasswordRequest = asyncHandler(async(req,res)=>{
const {email} = req.body;
const user = await User.findOne({email});

if(!user)
{
    throw new ApiError(404,"User doesn't exist");
}
const {unhasedToken,hashedToken,tokenExpiry} = user.temporaryToken()
user.forgotPasswordToken = hashedToken
user.forgotPasswordTokenExpiry = tokenExpiry

await user.save({validateBeforeSave:false});

await sendEmail ({
        email:user?.email,
        subject:"Password reset request",
        mailgenContent:EmailPasswordResetContent(
            `${process.env.FORGOT_PASSWORD_URL}/${unhasedToken}`
        )
    });

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Password reset request has been sent to your mail-id"

        )
    )

});
const resetForgotPassword = asyncHandler(async(req,res) =>{
    const{resetToken} = req.params
    const{newPassword} = req.body

    let hashedtoken = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex")

     const user = await User.findOne({
        forgotPasswordToken:hashedToken,
        forgotPasswordTokenExpiry:{$gt:Date.now()}
    });

    if(!user)
    {throw new ApiError(409 ,"Token is either invalid or expired...")};

    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    user.password = newPassword;

  await user.save({validateBeforeSave:false});
  
  return res
  .status(200)
  .json(
    new ApiResponse(
        200,
        {},
        "Password reset successfully"
    ));

})

const changeCurrentPassword = asyncHandler(async(req,res) =>{
  const {oldPassword,newPassword} = req.body;

   const user = await User.findById(req.user?._id);
   const isPasswordValid = await user.comparePassword(oldPassword);
    
   if(!isPasswordValid){
    throw new ApiError(404,"Invalid or Wrong Password");
};

user.password = newPassword;
await user.save({validateBeforeSave:false});

return res
.status(200)
.json(
    new ApiResponse(
        200,
        {},
        "Password changed Successfully"
    ));
});

   export {
  resetForgotPassword,
  changeCurrentPassword,
  forgotPasswordRequest,
  RegisterUser,
  login,
  logoutUser,
  getCurrentUser,
  verifyEmail,
  refreshAccessToken,
  resendEmailVerification
};