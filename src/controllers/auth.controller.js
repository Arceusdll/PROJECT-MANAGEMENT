    import {User} from "../models/user.models.js";
    import ApiResponse from "../utils/api-response.js";
    import { asyncHandler } from "../utils/async-handler.js";
    import {ApiError} from "../utils/api-error.js";
    import{EmailVerificationContent, sendEmail} from "../utils/mail.js";

    const generateAccessAndRefreshToken = async(userId) =>
    {
        try{
            const user = await User.findById(userId);
            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();
        
            user.refreshToken = refreshToken;
            await user.save({validateBeforeSave:false});
                return{accessToken,refreshToken}
        
        
        
        }catch(error){
            throw new ApiError(501,"Something Went Wrong while registering User");
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

    export {RegisterUser};