import { Router } from "express";
import {updateProject,updateMmeberROle,getPRojectMember,getProject,getProjectByID,addMembersToProject,deleteMember,createProject,deleteProject} from "../controllers/project.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import {addMemberToProjectValidator,createProjectValidator} from "../validators/index.js"; 
import { verifyJWT,validateProjectPermission } from "../middlewares/auth.middleware.js";
import { AvailableRoles, UserRolesEnum } from "../utils/constants.js";
const router = Router();
router.use(verifyJWT);

router
.route("/")
.get(getProject)
.post(createProjectValidator(),validate,createProject);

router
.route("/:projectId")
.get(validateProjectPermission(AvailableRoles),getProjectByID)
.put( 
    validateProjectPermission([UserRolesEnum.ADMIN]),
    createProjectValidator(),
    validate,
    updateProject
)
.delete(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    deleteProject
    
);

router
.route("/:projectId/members/")
.get(getPRojectMember)
.put(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    addMemberToProjectValidator(),
    validate,
    addMembersToProject
)

router
.route("/:projectId/members/:userId")
.put(validateProjectPermission([UserRolesEnum.ADMIN]),updateMmeberROle)
.delete(validateProjectPermission([UserRolesEnum.ADMIN]),deleteMember)







export default router;