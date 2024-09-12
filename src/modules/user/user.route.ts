import express from "express";
import { userControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import upload from "../../middlewares/multerMiddleware";
import { protectRoute } from "../../middlewares/protectRoute";
import { userRole } from "./user.constants";

const router = express.Router();

router.get('/profile', protectRoute([...userRole]),  userControllers.userProfileController);

router.get("/instructors/search", userControllers.searchInstructorsController);

router.get("/search", userControllers.searchUsersController);

router.get("/instructors", userControllers.instructorController);


router.post("/create-instructor", protectRoute([userRole[2], userRole[3]]), userControllers.createInstructorController);


router.post('/register', upload.single('avatar'), validateRequest(UserValidations.userRegistrationValidations), userControllers.registerController);

router.post('/login', validateRequest(UserValidations.userLoginValidations), userControllers.loginController);

router.post('/logout', validateRequest(UserValidations.userLogoutValidations), userControllers.logoutController);






export const UserRoutes = router;
