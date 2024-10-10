import { Request, Response } from "express";
import {
  createBulkCoursesService,
  createContentService,
  createCourseService,
  createModuleService,
  getCourseByIdService,
  getCoursesService,
  getFreeCoursesService,
  updateContentService,
  updateCourseService,
  updateModuleService,
} from "./course.service";

// Create a course
export const createCourse = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const newCourse = await createCourseService(req.body);
    console.log("new: ", newCourse);
    res.status(201).json(newCourse);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: (error as Error).message });
  }
};

// Create a module for a course
export const createModule = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;
    const moduleData = req.body;
    const updatedCourse = await createModuleService(courseId, moduleData);
    res.status(201).json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: (error as Error)?.message });
  }
};

// Create content for a module
export const createContent = async (req: Request, res: Response) => {
  try {
    const { courseId, moduleId } = req.params;
    const contentData = req.body;
    const updatedModule = await createContentService(
      courseId,
      moduleId,
      contentData
    );
    res.status(201).json(updatedModule);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Update a course
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;
    const courseData = req.body;
    const updatedCourse = await updateCourseService(courseId, courseData);
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Update a module
export const updateModule = async (req: Request, res: Response) => {
  try {
    const { courseId, moduleId } = req.params;
    const moduleData = req.body;
    const updatedModule = await updateModuleService(
      courseId,
      moduleId,
      moduleData
    );
    res.status(200).json(updatedModule);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Update content within a module
export const updateContent = async (req: Request, res: Response) => {
  try {
    const { courseId, moduleId, contentId } = req.params;
    const contentData = req.body;
    const updatedContent = await updateContentService(
      courseId,
      moduleId,
      contentId,
      contentData
    );
    res.status(200).json(updatedContent);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Pagination for getting courses
export const getCourses = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 9 } = req.query;
    const courses = await getCoursesService(Number(page), Number(limit));
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};


// Pagination for getting free courses
export const getFreeCourses = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 9 } = req.query;
    const courses = await getFreeCoursesService(Number(page), Number(limit));
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Get a course by ID
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;
    const course = await getCourseByIdService(courseId);
    res.status(200).json(course);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};

export const createBulkCourses = async (req: Request, res: Response) => {
  try {
    const coursesData = req.body;
    coursesData.instructors = [req?.user?._id];
    const createdCourses = await createBulkCoursesService(coursesData);
    return res
      .status(201)
      .json({ message: "Courses created successfully", data: createdCourses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create courses",
      error: (error as Error).message,
    });
  }
};