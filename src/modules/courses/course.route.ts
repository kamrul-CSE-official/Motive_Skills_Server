import express from "express";
import { protectRoute } from "../../middlewares/protectRoute";
import { userRoleConst } from "../user/user.constants";
import { CourseControllers } from "./course.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CourseValidations } from "./course.validation";
import upload from "../../middlewares/multerMiddleware";

const router = express.Router();

// Route to create a new course
router.post(
  "/create",
  upload.single("avatar"),
  protectRoute([
    userRoleConst.instructor,
    userRoleConst.admin,
    userRoleConst.superAdmin,
  ]),
  validateRequest(CourseValidations.courseCreationValidation),
  CourseControllers.createCourseController
);

// Route to update an existing course
router.patch(
  "/update/:courseId",
  protectRoute([
    userRoleConst.admin,
    userRoleConst.superAdmin,
  ]),
  validateRequest(CourseValidations.courseUpdateValidation),
  CourseControllers.updateCourseController
);

// Route to grant instructor access to a user
router.patch(
  "/grant-instructor-access/:userId",
  protectRoute([userRoleConst.admin, userRoleConst.superAdmin]),
  validateRequest(CourseValidations.assignInstructorValidation),
  CourseControllers.giveInstructorAccessController
);

// Route to assign multiple instructors to a course
router.post(
  "/assign-instructor/:courseId",
  protectRoute([userRoleConst.admin, userRoleConst.superAdmin]),
  validateRequest(CourseValidations.addInstructorsACourse),
  CourseControllers.assingInstructorsForACourseController
);

// Route to create a new module in a course
router.post(
  "/:courseId/module",
  protectRoute([
    userRoleConst.instructor,
    userRoleConst.admin,
    userRoleConst.superAdmin,
  ]),
  validateRequest(CourseValidations.createModuleValidation),
  CourseControllers.createModuleController
);

// Route to add content to a module in a course
router.post(
  "/:courseId/module/:moduleId/content",
  protectRoute([
    userRoleConst.instructor,
    userRoleConst.admin,
    userRoleConst.superAdmin,
  ]),
  validateRequest(CourseValidations.createContentValidation),
  CourseControllers.createContentController
);

// Route to delete a course
router.delete(
  "/delete/:courseId",
  protectRoute([
    userRoleConst.instructor,
    userRoleConst.admin,
    userRoleConst.superAdmin,
  ]),
  CourseControllers.deleteCourseController
);

// Route to delete a module from a course
router.delete(
  "/:courseId/module/:moduleId",
  protectRoute([
    userRoleConst.instructor,
    userRoleConst.admin,
    userRoleConst.superAdmin,
  ]),
  CourseControllers.deleteModuleController
);

// Route to delete content from a module in a course
router.delete(
  "/:courseId/module/:moduleId/content/:contentId",
  protectRoute([
    userRoleConst.instructor,
    userRoleConst.admin,
    userRoleConst.superAdmin,
  ]),
  CourseControllers.deleteContentController
);

// Route to add a review to a course
router.post(
  "/review/:courseId",
  protectRoute([userRoleConst.user]),
  validateRequest(CourseValidations.addReviewValidation),
  CourseControllers.addReviewController
);

// Route to add a comment to a course
router.post(
  "/comment/:courseId",
  protectRoute([userRoleConst.user]),
  validateRequest(CourseValidations.addCommentValidation),
  CourseControllers.addCommentController
);

export const CourseRoutes = router;
