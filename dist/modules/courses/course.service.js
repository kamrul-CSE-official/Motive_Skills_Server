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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFreeCoursesService = exports.getCourseByIdService = exports.getCoursesService = exports.updateContentService = exports.updateModuleService = exports.updateCourseService = exports.createContentService = exports.createModuleService = exports.createCourseService = exports.createBulkCoursesService = void 0;
const course_model_1 = __importDefault(require("./course.model"));
// Bulk post
const createBulkCoursesService = (coursesData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdCourses = yield course_model_1.default.insertMany(coursesData);
        return createdCourses;
    }
    catch (error) {
        throw new Error("Database error: " + error.message);
    }
});
exports.createBulkCoursesService = createBulkCoursesService;
// Service for creating a course
const createCourseService = (courseData) => __awaiter(void 0, void 0, void 0, function* () {
    const newCourse = new course_model_1.default(courseData);
    return yield newCourse.save();
});
exports.createCourseService = createCourseService;
// Service for creating a module within a course
const createModuleService = (courseId, moduleData) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_model_1.default.findById(courseId);
    if (!course)
        throw new Error("Course not found");
    // Ensure the modules array is initialized
    if (!course.modules) {
        course.modules = [];
    }
    course.modules.push(moduleData);
    return yield course.save();
});
exports.createModuleService = createModuleService;
// Service for creating content within a module
const createContentService = (courseId, moduleId, contentData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const course = yield course_model_1.default.findById(courseId);
    if (!course)
        throw new Error("Course not found");
    const module = (_a = course.modules) === null || _a === void 0 ? void 0 : _a.find((m) => { var _a; return ((_a = m._id) === null || _a === void 0 ? void 0 : _a.toString()) === moduleId; }); // Use .id() to find the module by _id
    if (!module)
        throw new Error("Module not found");
    if (!module.contents) {
        module.contents = [];
    }
    module.contents.push(contentData);
    return yield course.save();
});
exports.createContentService = createContentService;
// Service for updating a course
const updateCourseService = (courseId, courseData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield course_model_1.default.findByIdAndUpdate(courseId, courseData, { new: true });
});
exports.updateCourseService = updateCourseService;
// Service for updating a module within a course
const updateModuleService = (courseId, moduleId, moduleData) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const course = yield course_model_1.default.findById(courseId);
    if (!course)
        throw new Error("Course not found");
    const module = (_b = course.modules) === null || _b === void 0 ? void 0 : _b.find((m) => { var _a; return ((_a = m._id) === null || _a === void 0 ? void 0 : _a.toString()) === moduleId; }); // Use .id() to find the module by _id
    if (!module)
        throw new Error("Module not found");
    Object.assign(module, moduleData);
    return yield course.save();
});
exports.updateModuleService = updateModuleService;
// Service for updating content within a module
const updateContentService = (courseId, moduleId, contentId, contentData) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const course = yield course_model_1.default.findById(courseId);
    if (!course)
        throw new Error("Course not found");
    const module = (_c = course.modules) === null || _c === void 0 ? void 0 : _c.find((m) => { var _a; return ((_a = m._id) === null || _a === void 0 ? void 0 : _a.toString()) === moduleId; }); // Use .id() to find the module by _id
    if (!module)
        throw new Error("Module not found");
    const content = (_d = module.contents) === null || _d === void 0 ? void 0 : _d.find((m) => { var _a; return ((_a = m._id) === null || _a === void 0 ? void 0 : _a.toString()) === contentId; }); // Use .id() to find content by _id
    if (!content)
        throw new Error("Content not found");
    Object.assign(content, contentData);
    return yield course.save();
});
exports.updateContentService = updateContentService;
// Service for getting courses with pagination
const getCoursesService = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    return yield course_model_1.default.find().skip(skip).limit(limit);
});
exports.getCoursesService = getCoursesService;
// Service for getting a course by ID
const getCourseByIdService = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield course_model_1.default.findById(courseId);
});
exports.getCourseByIdService = getCourseByIdService;
// Service for getting a free courses
const getFreeCoursesService = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    return yield course_model_1.default.find({ isFree: true }).skip(skip).limit(limit);
});
exports.getFreeCoursesService = getFreeCoursesService;
