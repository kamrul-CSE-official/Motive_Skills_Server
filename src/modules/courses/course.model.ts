import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ICourse } from "./course.interface";

// Define the ReviewSchema
const ReviewSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

// Define the Cueries
const QueriesSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

// Define the ContentSchema
const ContentSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ["video", "text", "assignment"],
      required: [true, "Content type is required."],
    },
    id: {
      type: String,
      default: uuidv4,
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
  },
  { timestamps: true }
);

// Define the ModuleSchema
const ModuleSchema: Schema = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    title: {
      type: String,
      required: [true, "Module title is required."],
    },
    id: {
      type: String,
      default: uuidv4, 
      unique: true,
    },
    description: {
      type: String,
    },
    contents: [ContentSchema], 
  },
  { timestamps: true }
);

// Define the CourseSchema
const CourseSchema: Schema = new Schema(
  {
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
        type: mongoose.Schema.Types.ObjectId,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    reviews: [ReviewSchema],
    queries: [QueriesSchema],
  },
  { timestamps: true }
);

export default mongoose.model<ICourse>("Course", CourseSchema);
