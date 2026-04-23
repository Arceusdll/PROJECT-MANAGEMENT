import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    avatar:{
        type :{
            url:String,
            localPath : String
        },
        default :{
            url:`https://placehold.co/200x200`,
            localPath:""
        }
    },
    username :{
        type:String,
        required : true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    
    },
    fullName :{
        type:String,
        required:true,      
        trim:true,
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    isEmailVerified:{
        type:Boolean,
        default:false,

    },
    refreshToken :{
        type:String,
        default:"",
    },
    forgotPasswordToken :{
        type:String,
    },
    forgotPasswordTokenExpiry :{
        type:Date,
    },
    emailVerificationToken :{
        type:String,
    },
    emailVerificationTokenExpiry :{
        type:Date,
    },
     
},{
    timestamps:true,
}
);
userSchema.pre("save",async function(){
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password,10);

});

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);

}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIN:process.env.ACCESS_TOKEN_EXPIRY || "1d"}
    )
};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIN:process.env.REFRESH_TOKEN_EXPIRY}
    )
};
userSchema.methods.temporaryToken = function()
{
 const unhasedToken =crypto.randomBytes(20).toString("hex");
 const hashedToken = crypto.createHash("sha256")
 .update(unhasedToken)
 .digest("hex");

 const tokenExpiry = Date.now()+(20*60*1000);
 return {unhasedToken,hashedToken,tokenExpiry};
};

export const User = mongoose.model("User",userSchema);