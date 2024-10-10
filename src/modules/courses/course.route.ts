import express from "express";
import {
  createBulkCourses,
  createContent,
  createCourse,
  createModule,
  getCourseById,
  getCourses,
  getFreeCourses,
  updateContent,
  updateCourse,
  updateModule,
} from "./course.controller";
import { protectRoute } from "../../middlewares/protectRoute";
import { userRoleConst } from "../user/user.constants";

const router = express.Router();

router.post(
  "/bulk",
  protectRoute([
    userRoleConst.admin,
    userRoleConst.instructor,
    userRoleConst.superAdmin,
  ]),
  createBulkCourses
);

// Course routes
router.post(
  "/create",
  protectRoute([
    userRoleConst.admin,
    userRoleConst.instructor,
    userRoleConst.superAdmin,
  ]),
  createCourse
);


router.put(
  "/:courseId",
  protectRoute([
    userRoleConst.admin,
    userRoleConst.instructor,
    userRoleConst.superAdmin,
  ]),
  updateCourse
);


router.get("/", getCourses); 
router.get("/free", getFreeCourses); 
router.get("/:courseId", getCourseById);

// Module routes
router.post(
  "/:courseId/module",
  protectRoute([
    userRoleConst.admin,
    userRoleConst.instructor,
    userRoleConst.superAdmin,
  ]),
  createModule
);
router.put(
  "/:courseId/module/:moduleId",
  protectRoute([
    userRoleConst.admin,
    userRoleConst.instructor,
    userRoleConst.superAdmin,
  ]),
  updateModule
);

// Content routes
router.post(
  "/:courseId/module/:moduleId/content",
  protectRoute([
    userRoleConst.admin,
    userRoleConst.instructor,
    userRoleConst.superAdmin,
  ]),
  createContent
);
router.put(
  "/:courseId/module/:moduleId/content/:contentId",
  protectRoute([
    userRoleConst.admin,
    userRoleConst.instructor,
    userRoleConst.superAdmin,
  ]),
  updateContent
);

export const courseRoutes = router;
