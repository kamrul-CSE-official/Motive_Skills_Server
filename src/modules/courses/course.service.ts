import mongoose, { Types } from "mongoose";
import User from "../user/user.model";
import Course from "./course.model";
import {
  IComment,
  IContent,
  ICourse,
  IModule,
  IReview,
} from "./course.interface";
import { IUser } from "../user/user.interface";
import { userRoleConst } from "../user/user.constants";

// Helper function to check if a user has the required role
const checkUserRole = async (userId: string | Types.ObjectId, roles: string[]): Promise<boolean> => {
  const user = await User.findById(userId).select("+role");
  if (!user) throw new Error("User not found.");
  return roles.includes(user.role);
};

// Helper function to validate all instructors
const validateInstructors = async (instructorIds: Types.ObjectId[]): Promise<void> => {
  for (const instructorId of instructorIds) {
    const isInstructor = await checkUserRole(instructorId, [userRoleConst.instructor]);
    if (!isInstructor) {
      throw new Error(`User with ID ${instructorId} is not an instructor.`);
    }
  }
};

// Service to create a course
const createCourseService = async (
  courseData: ICourse,
  userId: string
): Promise<ICourse> => {
  // Check if the user creating the course has the admin or superAdmin role
  const isAuthorized = await checkUserRole(userId, [
    userRoleConst.admin,
    userRoleConst.superAdmin,
  ]);

  if (!isAuthorized) {
    throw new Error("Only admins or super admins can create courses.");
  }

  // Validate that all instructor IDs belong to users with the instructor role
  if (courseData?.instructors && courseData?.instructors?.length > 0) {
    await validateInstructors(courseData?.instructors);
  }

  // Create the course
  const newCourse = new Course({ ...courseData });
  return await newCourse.save();
};

// Service to give instructor access to a user
const giveInstructorAccessService = async (
  userId: string,
  adminId: string
): Promise<IUser> => {
  const isAdminOrSuperAdmin = await checkUserRole(adminId, [
    userRoleConst.admin,
    userRoleConst.superAdmin,
  ]);

  if (!isAdminOrSuperAdmin) {
    throw new Error("Only admin or super-admin can give instructor access.");
  }

  const user = (await User.findById(userId)) as IUser;
  if (!user) throw new Error("User not found.");


  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { role: userRoleConst.instructor },
    { new: true }
  );


  if (!updatedUser) throw new Error("Failed to update user role.");
  return updatedUser;
};

// Service to create a module in a course
const createModuleService = async (
  courseId: string,
  moduleData: IModule,
  userId: string
): Promise<ICourse> => {
  const course = (await Course.findById(courseId)) as ICourse;
  if (!course) throw new Error("Course not found.");

  const isAuthorized = checkUserRole(userId, [userRoleConst.admin, userRoleConst.superAdmin, userRoleConst.instructor]);

  if (!isAuthorized) {
    throw new Error("You are not authorized to create modules for this course.");
  }

  if (!course.modules) {
    course.modules = [];
  }

  course.modules.push(moduleData);
  return await course.save();
};

// Service to create content in a module
const createContentService = async (
  courseId: string,
  moduleId: string,
  contentData: IContent,
  userId: string
): Promise<ICourse> => {
  const course = (await Course.findById(courseId)) as ICourse;
  if (!course) throw new Error("Course not found.");

  const module = course.modules?.find(
    (mod: IModule) => mod._id?.toString() === moduleId
  );
  if (!module) throw new Error("Module not found.");

  const isAuthorized =
    course.instructors?.includes(new Types.ObjectId(userId)) ||
    course.authorizedInstructors?.includes(new Types.ObjectId(userId));

  if (!isAuthorized) {
    throw new Error("You are not authorized to create content for this module.");
  }

  if (!module.contents) {
    module.contents = [];
  }

  module.contents.push(contentData);
  return await course.save();
};

// Service to update a course
const updateCourseService = async (
  courseId: string,
  updateData: Partial<ICourse>,
  userId: string
): Promise<ICourse> => {
  const course = (await Course.findById(courseId)) as ICourse;
  if (!course) throw new Error("Course not found.");

  const isAuthorized =
    course.instructors?.includes(new Types.ObjectId(userId)) ||
    course.authorizedInstructors?.includes(new Types.ObjectId(userId)) ||
    (await checkUserRole(userId, [userRoleConst.admin, userRoleConst.superAdmin]));

  if (!isAuthorized) {
    throw new Error("You are not authorized to update this course.");
  }

  Object.assign(course, updateData);
  return await course.save();
};

// Service to add a review to a course
const addReviewService = async (
  courseId: string,
  reviewData: Omit<IReview, "userId">,
  userId: string
): Promise<ICourse> => {
  const course = await Course.findById(courseId) as ICourse;
  if (!course) throw new Error("Course not found.");

  const review: IReview = { ...reviewData, userId: new Types.ObjectId(userId) };

  if (!course.reviews) {
    course.reviews = [];
  }

  course.reviews.push(review);
  return await course.save();
};

// Service to add a comment to a course
const addCommentService = async (
  courseId: string,
  commentData: Omit<IComment, "userId">,
  userId: string
): Promise<ICourse> => {
  const course = await Course.findById(courseId) as ICourse;
  if (!course) throw new Error("Course not found.");

  const comment: IComment = { ...commentData, userId: new Types.ObjectId(userId) };

  if (!course.comments) {
    course.comments = [];
  }

  course.comments.push(comment);
  return await course.save();
};

// Service to delete a course
const deleteCourseService = async (
  courseId: string,
  userId: string
): Promise<void> => {
  const course = (await Course.findById(courseId)) as ICourse;
  if (!course) throw new Error("Course not found.");

  const isAuthorized =
    course.instructors?.includes(new Types.ObjectId(userId)) ||
    course.authorizedInstructors?.includes(new Types.ObjectId(userId)) ||
    (await checkUserRole(userId, [userRoleConst.admin]));

  if (!isAuthorized) {
    throw new Error("You are not authorized to delete this course.");
  }

  await Course.findByIdAndDelete(courseId);
};

// Service to delete a module from a course
const deleteModuleService = async (
  courseId: string,
  moduleId: string,
  userId: string
): Promise<ICourse> => {
  const course = (await Course.findById(courseId)) as ICourse;
  if (!course) throw new Error("Course not found.");

  const isAuthorized =
    course.authorizedInstructors?.includes(new Types.ObjectId(userId)) ||
    (await checkUserRole(userId, [userRoleConst.admin]));

  if (!isAuthorized) {
    throw new Error("You are not authorized to delete modules for this course.");
  }

  course.modules = course.modules?.filter(
    (module) => module._id?.toString() !== moduleId
  );

  return await course.save();
};

// Service to delete content from a module
const deleteContentService = async (
  courseId: string,
  moduleId: string,
  contentId: string,
  userId: string
): Promise<ICourse> => {
  const course = (await Course.findById(courseId)) as ICourse;
  if (!course) throw new Error("Course not found.");

  const module = course.modules?.find(
    (mod) => mod._id?.toString() === moduleId
  ) as IModule;
  if (!module) throw new Error("Module not found.");

  const isAuthorized =
    course.instructors?.includes(new Types.ObjectId(userId)) ||
    course.authorizedInstructors?.includes(new Types.ObjectId(userId));

  if (!isAuthorized) {
    throw new Error("You are not authorized to delete content from this module.");
  }

  module.contents = module.contents?.filter(
    (content) => content.id !== contentId
  );

  return await course.save();
};


// assignInstructorsForACourse
const assignInstructorsForACourse = async (courseId: string, instructorIds: string[], userId: string) => {
  try {
    // Check if the user is authorized (admin or super-admin)
    const isAuthorized = await checkUserRole(userId, [userRoleConst.admin, userRoleConst.superAdmin]);
    
    if (!isAuthorized) {
      throw new Error('Only admin or super-admin can perform this operation!');
    }

    // Find the course by its ID
    const course = await Course.findById(courseId) as ICourse;

    if (!course) {
      throw new Error('Course not found');
    }

    // Ensure that all instructors are valid users and have the role of 'instructor'
    const validInstructors = await User.find({
      _id: { $in: instructorIds },
      role: 'instructor',
    }).select('_id role');

    if (validInstructors.length !== instructorIds.length) {
      throw new Error('Some instructors are invalid');
    }

    // Add only the instructors who are not already assigned
    const newInstructors = instructorIds.filter((instructorId) => 
      !course?.instructors?.includes(new mongoose.Types.ObjectId(instructorId))
    );

    if (newInstructors.length === 0) {
      throw new Error('All provided instructors are already assigned to this course');
    }

    // Push new instructors to the course
    course?.instructors?.push(...newInstructors.map(id => new mongoose.Types.ObjectId(id)));

    // Save the updated course
    await course.save();

    return course;
  } catch (error) {
    throw new Error((error as Error).message || 'An error occurred while assigning instructors');
  }
};


// Export services as an object
export const CourseServices = {
  createCourseService,
  giveInstructorAccessService,
  createModuleService,
  createContentService,
  updateCourseService,
  addReviewService,
  addCommentService,
  deleteCourseService,
  deleteModuleService,
  deleteContentService,
  assignInstructorsForACourse
};
