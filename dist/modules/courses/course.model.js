"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const uuid_1 = require("uuid");
// Define the ReviewSchema
const ReviewSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required."],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 1,
        required: [true, "User rating is required."],
    },
    comment: {
        type: String,
        required: [true, "User comment is required."],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
// Define the Cueries
const QueriesSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required."],
    },
    content: {
        type: String,
        required: [true, "Comment/queries is required."],
    },
    replay: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
// Define the ContentSchema
const ContentSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["video", "text", "assignment"],
        required: [true, "Content type is required."],
    },
    id: {
        type: String,
        default: uuid_1.v4,
        unique: true,
    },
    videoUrl: {
        type: String,
        required: false,
    },
    text: {
        type: String,
        required: false,
    },
    assignment: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: [true, "Content title is required."],
    },
    content: {
        type: String,
        required: [true, "Content body is required."],
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
// Define the ModuleSchema
const ModuleSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId },
    title: {
        type: String,
        required: [true, "Module title is required."],
    },
    id: {
        type: String,
        default: uuid_1.v4,
        unique: true,
    },
    description: {
        type: String,
    },
    contents: [ContentSchema],
}, { timestamps: true });
// Define the CourseSchema
const CourseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Course title is required."],
    },
    description: {
        type: String,
        required: [true, "Course description is required."],
    },
    instructors: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    avatar: {
        type: String,
        required: [true, "Course avatar is required."],
    },
    duration: {
        type: String,
        required: [true, "Course duration is required."],
    },
    price: {
        type: Number,
        required: [true, "Course price is required."],
        default: 0,
    },
    isFree: {
        type: Boolean,
        default: false,
    },
    couponCodes: [
        {
            key: {
                type: String,
                required: false,
            },
            discount: {
                type: Number,
                required: false,
            },
        },
    ],
    modules: [ModuleSchema],
    studentsEnrolled: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    reviews: [ReviewSchema],
    queries: [QueriesSchema],
}, { timestamps: true });
exports.default = mongoose_1.default.model("Course", CourseSchema);
