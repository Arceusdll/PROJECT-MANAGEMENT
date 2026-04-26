import { Router } from "express";
import {login, logoutUser, RegisterUser} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterValidator,userLoginValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();


router.route("/register").post(userRegisterValidator(),validate,RegisterUser);
router.route("/login").post(userLoginValidator(),validate,login);
router.route("/logout").post(verifyJWT,logoutUser);


export default router;