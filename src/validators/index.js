import { body } from "express-validator";



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

export{
    userRegisterValidator,userLoginValidator
};