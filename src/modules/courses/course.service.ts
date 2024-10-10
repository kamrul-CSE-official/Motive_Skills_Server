import { IContent, ICourse, IModule } from "./course.interface";
import Course from "./course.model";

// Bulk post
export const createBulkCoursesService = async (coursesData: ICourse) => {
  try {
    const createdCourses = await Course.insertMany(coursesData);
    return createdCourses;
  } catch (error) {
    throw new Error("Database error: " + (error as Error).message);
  }
};

// Service for creating a course
export const createCourseService = async (courseData: ICourse) => {
  const newCourse = new Course(courseData);
  return await newCourse.save();
};

// Service for creating a module within a course
export const createModuleService = async (
  courseId: string,
  moduleData: IModule
) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  // Ensure the modules array is initialized
  if (!course.modules) {
    course.modules = [];
  }

  course.modules.push(moduleData);
  return await course.save();
};

// Service for creating content within a module
export const createContentService = async (
  courseId: string,
  moduleId: string,
  contentData: IContent
) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const module = course.modules?.find((m) => m._id?.toString() === moduleId); // Use .id() to find the module by _id
  if (!module) throw new Error("Module not found");

  if (!module.contents) {
    module.contents = [];
  }

  module.contents.push(contentData);
  return await course.save();
};

// Service for updating a course
export const updateCourseService = async (
  courseId: string,
  courseData: Partial<ICourse>
) => {
  return await Course.findByIdAndUpdate(courseId, courseData, { new: true });
};

// Service for updating a module within a course
export const updateModuleService = async (
  courseId: string,
  moduleId: string,
  moduleData: Partial<IModule>
) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const module = course.modules?.find((m) => m._id?.toString() === moduleId); // Use .id() to find the module by _id
  if (!module) throw new Error("Module not found");

  Object.assign(module, moduleData);
  return await course.save();
};

// Service for updating content within a module
export const updateContentService = async (
  courseId: string,
  moduleId: string,
  contentId: string,
  contentData: Partial<IContent>
) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const module = course.modules?.find((m) => m._id?.toString() === moduleId); // Use .id() to find the module by _id
  if (!module) throw new Error("Module not found");

  const content = module.contents?.find((m) => m._id?.toString() === contentId); // Use .id() to find content by _id
  if (!content) throw new Error("Content not found");

  Object.assign(content, contentData);
  return await course.save();
};

// Service for getting courses with pagination
export const getCoursesService = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  return await Course.find().skip(skip).limit(limit);
};

// Service for getting a course by ID
export const getCourseByIdService = async (courseId: string) => {
  return await Course.findById(courseId);
};


// Service for getting a free courses
export const getFreeCoursesService = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  return await Course.find({isFree: true}).skip(skip).limit(limit);
};