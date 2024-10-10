"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("./course.controller");
const protectRoute_1 = require("../../middlewares/protectRoute");
const user_constants_1 = require("../user/user.constants");
const router = express_1.default.Router();
router.post("/bulk", (0, protectRoute_1.protectRoute)([
    user_constants_1.userRoleConst.admin,
    user_constants_1.userRoleConst.instructor,
    user_constants_1.userRoleConst.superAdmin,
]), course_controller_1.createBulkCourses);
// Course routes
router.post("/create", (0, protectRoute_1.protectRoute)([
    user_constants_1.userRoleConst.admin,
    user_constants_1.userRoleConst.instructor,
    user_constants_1.userRoleConst.superAdmin,
]), course_controller_1.createCourse);
router.put("/:courseId", (0, protectRoute_1.protectRoute)([
    user_constants_1.userRoleConst.admin,
    user_constants_1.userRoleConst.instructor,
    user_constants_1.userRoleConst.superAdmin,
]), course_controller_1.updateCourse);
router.get("/", course_controller_1.getCourses);
router.get("/free", course_controller_1.getFreeCourses);
router.get("/:courseId", course_controller_1.getCourseById);
// Module routes
router.post("/:courseId/module", (0, protectRoute_1.protectRoute)([
    user_constants_1.userRoleConst.admin,
    user_constants_1.userRoleConst.instructor,
    user_constants_1.userRoleConst.superAdmin,
]), course_controller_1.createModule);
router.put("/:courseId/module/:moduleId", (0, protectRoute_1.protectRoute)([
    user_constants_1.userRoleConst.admin,
    user_constants_1.userRoleConst.instructor,
    user_constants_1.userRoleConst.superAdmin,
]), course_controller_1.updateModule);
// Content routes
router.post("/:courseId/module/:moduleId/content", (0, protectRoute_1.protectRoute)([
    user_constants_1.userRoleConst.admin,
    user_constants_1.userRoleConst.instructor,
    user_constants_1.userRoleConst.superAdmin,
]), course_controller_1.createContent);
router.put("/:courseId/module/:moduleId/content/:contentId", (0, protectRoute_1.protectRoute)([
    user_constants_1.userRoleConst.admin,
    user_constants_1.userRoleConst.instructor,
    user_constants_1.userRoleConst.superAdmin,
]), course_controller_1.updateContent);
exports.courseRoutes = router;
