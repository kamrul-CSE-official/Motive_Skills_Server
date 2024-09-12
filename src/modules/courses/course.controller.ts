import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { CourseServices } from "./course.service";
import { uploadImage } from "../../utils/uploadImage";
import { ICourse, IModule, IContent, IReview, IComment } from "./course.interface";


// Controller for creating a course (only by instructor)
const createCourseController = catchAsync(async (req: Request, res: Response) => {
  const courseData: ICourse = req.body;
  const userId: string = req.user?._id?.toString() || "";

  if (req?.file) {
    const avatarUrl = await uploadImage(req.file);
    courseData.avatar = avatarUrl || "";
  }

  const course = await CourseServices.createCourseService(courseData, userId);
  res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: course,
  });
});

// Controller for granting instructor access (admin/super-admin only)
const giveInstructorAccessController = catchAsync(async (req: Request, res: Response) => {

  const userId  = req.params?.userId as string;
  const adminId: string = req.user?._id?.toString() || "";
  await CourseServices.giveInstructorAccessService(userId, adminId);

  res.status(200).json({
    success: true,
    message: "Instructor access granted successfully",
  });
});

// Controller for creating a module (instructor/admin only)
const createModuleController = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userId: string = req.user?._id?.toString() || "";
  const moduleData: IModule = req.body;

  const course = await CourseServices.createModuleService(courseId, moduleData, userId);
  res.status(201).json({
    success: true,
    message: "Module added successfully",
    data: course,
  });
});

// Controller for creating content (instructor/admin only)
const createContentController = catchAsync(async (req: Request, res: Response) => {
  const { courseId, moduleId } = req.params;
  const userId: string = req.user?._id?.toString() || "";
  const contentData: IContent = req.body;

  const course = await CourseServices.createContentService(courseId, moduleId, contentData, userId);
  res.status(201).json({
    success: true,
    message: "Content added successfully",
    data: course,
  });
});

// Controller for updating a course (instructor/admin only)
const updateCourseController = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userId: string = req.user?._id?.toString() || "";
  const updateData: Partial<ICourse> = req.body;

  const course = await CourseServices.updateCourseService(courseId, updateData, userId);
  res.status(200).json({
    success: true,
    message: "Course updated successfully",
    data: course,
  });
});

// Controller for adding a review to a course
const addReviewController = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userId: string = req.user?._id?.toString() || "";
  const reviewData: Omit<IReview, "userId"> = req.body;

  const course = await CourseServices.addReviewService(courseId, reviewData, userId);
  res.status(201).json({
    success: true,
    message: "Review added successfully",
    data: course,
  });
});

// Controller for adding a comment to a course
const addCommentController = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userId: string = req.user?._id?.toString() || "";
  const commentData: Omit<IComment, "userId"> = req.body;

  const course = await CourseServices.addCommentService(courseId, commentData, userId);
  res.status(201).json({
    success: true,
    message: "Comment added successfully",
    data: course,
  });
});

// Controller for deleting a course (instructor/admin only)
const deleteCourseController = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userId: string = req.user?._id?.toString() || "";

  await CourseServices.deleteCourseService(courseId, userId);
  res.status(204).json({
    success: true,
    message: "Course deleted successfully",
  });
});

// Controller for deleting a module from a course (instructor/admin only)
const deleteModuleController = catchAsync(async (req: Request, res: Response) => {
  const { courseId, moduleId } = req.params;
  const userId: string = req.user?._id?.toString() || "";

  const course = await CourseServices.deleteModuleService(courseId, moduleId, userId);
  res.status(200).json({
    success: true,
    message: "Module deleted successfully",
    data: course,
  });
});

// Controller for deleting content from a module (instructor/admin only)
const deleteContentController = catchAsync(async (req: Request, res: Response) => {
  const { courseId, moduleId, contentId } = req.params;
  const userId: string = req.user?._id?.toString() || "";

  const course = await CourseServices.deleteContentService(courseId, moduleId, contentId, userId);
  res.status(200).json({
    success: true,
    message: "Content deleted successfully",
    data: course,
  });
});


// Controller for assigne instructors in a course (super admin/admin only)
const assingInstructorsForACourseController = catchAsync(async (req: Request, res: Response) => {
  const { instructorIds } = req.body;
  const {courseId}  = req.params;
  const userId: string = req.user?._id?.toString() || "";

  const addedInstructors = await CourseServices.assignInstructorsForACourse(courseId, instructorIds, userId);
  res.status(200).json({
    success: true,
    message: "Assign instructors successfully.",
    data: addedInstructors,
  });
});

export const CourseControllers = {
  createCourseController,
  giveInstructorAccessController,
  createModuleController,
  createContentController,
  updateCourseController,
  addReviewController,
  addCommentController,
  deleteCourseController,
  deleteModuleController,
  deleteContentController,
  assingInstructorsForACourseController
};
