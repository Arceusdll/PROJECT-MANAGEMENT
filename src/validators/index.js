import { body } from "express-validator";
import { AvailableRoles } from "../utils/constants.js";



const userRegisterValidator = () =>{
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),

        body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLowercase()
        .withMessage("Username must be in lower Case")
        .isLength(5)
        .withMessage("Username must be of atleast 5 characters")
        ,
        body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        ,
    
        body("fullName")
        .trim()
        .optional()

    ];
};
const userLoginValidator = () =>{
    return [
        body("email")
        .optional()
        .isEmail()
        .withMessage("Invalid Email"),
        body("password")
        .notEmpty()
        .withMessage("PASSWORD IS REQUIRED")
    ]
}

const userChangeCurrentPasswordValidator = () =>{
    return [
        body("oldPassword")
        .notEmpty()
        .withMessage("Old password is required"),
        body("newPassword")
        .notEmpty()
        .withMessage("New Password is requirde")

    ]
} 

const userForgotPasswordValidator =() =>{
    return [
        body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid")
    ]
}

const userResetForgotPasswordValidator =() =>{
    return [
        body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
    ]
}

const createProjectValidator = () =>{
    return[
        body("name")
        .notEmpty()
        .withMessage("Name is required"),
        body("description")
        .optional(),
    ]
}

const addMemberToProjectValidator = () =>{
    return [
        body("email")
        .isEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
        body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(AvailableRoles)
        .withMessage("Role not available"),

    ]
};
export{
 addMemberToProjectValidator,createProjectValidator,userRegisterValidator,userLoginValidator,userChangeCurrentPasswordValidator,userResetForgotPasswordValidator,userForgotPasswordValidator
};