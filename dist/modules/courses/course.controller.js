"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBulkCourses = exports.getCourseById = exports.getFreeCourses = exports.getCourses = exports.updateContent = exports.updateModule = exports.updateCourse = exports.createContent = exports.createModule = exports.createCourse = void 0;
const course_service_1 = require("./course.service");
// Create a course
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const newCourse = yield (0, course_service_1.createCourseService)(req.body);
        console.log("new: ", newCourse);
        res.status(201).json(newCourse);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});
exports.createCourse = createCourse;
// Create a module for a course
const createModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params.courseId;
        const moduleData = req.body;
        const updatedCourse = yield (0, course_service_1.createModuleService)(courseId, moduleData);
        res.status(201).json(updatedCourse);
    }
    catch (error) {
        res.status(400).json({ message: error === null || error === void 0 ? void 0 : error.message });
    }
});
exports.createModule = createModule;
// Create content for a module
const createContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId, moduleId } = req.params;
        const contentData = req.body;
        const updatedModule = yield (0, course_service_1.createContentService)(courseId, moduleId, contentData);
        res.status(201).json(updatedModule);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createContent = createContent;
// Update a course
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params.courseId;
        const courseData = req.body;
        const updatedCourse = yield (0, course_service_1.updateCourseService)(courseId, courseData);
        res.status(200).json(updatedCourse);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateCourse = updateCourse;
// Update a module
const updateModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId, moduleId } = req.params;
        const moduleData = req.body;
        const updatedModule = yield (0, course_service_1.updateModuleService)(courseId, moduleId, moduleData);
        res.status(200).json(updatedModule);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateModule = updateModule;
// Update content within a module
const updateContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId, moduleId, contentId } = req.params;
        const contentData = req.body;
        const updatedContent = yield (0, course_service_1.updateContentService)(courseId, moduleId, contentId, contentData);
        res.status(200).json(updatedContent);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateContent = updateContent;
// Pagination for getting courses
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 9 } = req.query;
        const courses = yield (0, course_service_1.getCoursesService)(Number(page), Number(limit));
        res.status(200).json(courses);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getCourses = getCourses;
// Pagination for getting free courses
const getFreeCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 9 } = req.query;
        const courses = yield (0, course_service_1.getFreeCoursesService)(Number(page), Number(limit));
        res.status(200).json(courses);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getFreeCourses = getFreeCourses;
// Get a course by ID
const getCourseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params.courseId;
        const course = yield (0, course_service_1.getCourseByIdService)(courseId);
        res.status(200).json(course);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
exports.getCourseById = getCourseById;
const createBulkCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const coursesData = req.body;
        coursesData.instructors = [(_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id];
        const createdCourses = yield (0, course_service_1.createBulkCoursesService)(coursesData);
        return res
            .status(201)
            .json({ message: "Courses created successfully", data: createdCourses });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to create courses",
            error: error.message,
        });
    }
});
exports.createBulkCourses = createBulkCourses;
