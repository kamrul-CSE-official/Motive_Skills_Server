import { Request, Response, NextFunction } from "express";
import { IUser } from "../modules/user/user.interface";
import { Types } from "mongoose";
import Course from "../modules/courses/course.model";

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}

// Middleware to check if the user is enrolled in the course
export const checkEnrollment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?._id;

    if (!userId || !Types.ObjectId.isValid(userId.toString())) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    if (!Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID." });
    }

    // Find the course and check if the user is enrolled
    const course = await Course.findById(courseId).populate(
      "studentsEnrolled",
      "_id"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Ensure that 'studentsEnrolled' is treated as an array, or provide a fallback empty array
    const studentsEnrolled = course?.studentsEnrolled || [];

    // Check if the user is in the studentsEnrolled list
    const isEnrolled = studentsEnrolled.some(
      (student) => student?._id.toString() === userId.toString()
    );

    if (!isEnrolled) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course." });
    }

    // If enrolled, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error in checkEnrollment middleware:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
