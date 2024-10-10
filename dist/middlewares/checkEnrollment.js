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
exports.checkEnrollment = void 0;
const mongoose_1 = require("mongoose");
const course_model_1 = __importDefault(require("../modules/courses/course.model"));
// Middleware to check if the user is enrolled in the course
const checkEnrollment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { courseId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId || !mongoose_1.Types.ObjectId.isValid(userId.toString())) {
            return res.status(400).json({ message: "Invalid user ID." });
        }
        if (!mongoose_1.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Invalid course ID." });
        }
        // Find the course and check if the user is enrolled
        const course = yield course_model_1.default.findById(courseId).populate("studentsEnrolled", "_id");
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }
        // Ensure that 'studentsEnrolled' is treated as an array, or provide a fallback empty array
        const studentsEnrolled = (course === null || course === void 0 ? void 0 : course.studentsEnrolled) || [];
        // Check if the user is in the studentsEnrolled list
        const isEnrolled = studentsEnrolled.some((student) => (student === null || student === void 0 ? void 0 : student._id.toString()) === userId.toString());
        if (!isEnrolled) {
            return res
                .status(403)
                .json({ message: "You are not enrolled in this course." });
        }
        // If enrolled, proceed to the next middleware or route handler
        next();
    }
    catch (error) {
        console.error("Error in checkEnrollment middleware:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.checkEnrollment = checkEnrollment;
