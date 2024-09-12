import { z } from "zod";

// Content validation schema
const contentValidation = z.object({
  type: z.enum(["video", "text", "assignment"], {
    required_error: "Content type is required and must be one of: 'video', 'text', or 'assignment'.",
  }),
  videoUrl: z.string().url("Invalid video URL format.").optional(),
  text: z.string().optional(),
  assignment: z.string().optional(),
  description: z.string().optional(),
  title: z.string().nonempty({ message: "Content title is required." }),
  content: z.string().nonempty({ message: "Content body is required." }),
  isPublic: z.boolean().optional(),
});

// Module validation schema
const moduleValidation = z.object({
  title: z.string().nonempty({ message: "Module title is required." }),
  description: z.string().optional(),
  contents: z.array(contentValidation),
});

// Course validation schema
const courseCreationValidation = z.object({
  body: z.object({
    title: z.string().nonempty({ message: "Course title is required." }),
    description: z.string().nonempty({ message: "Course description is required." }),
    instructors: z.array(z.string().nonempty({ message: "Instructor ID cannot be empty." })).nonempty({
      message: "At least one instructor ID is required.",
    }),
    avatar: z.string().url({ message: "Invalid avatar URL format." }).nonempty({ message: "Course avatar is required." }),
    duration: z.string().nonempty({ message: "Course duration is required." }),
    price: z.number().nonnegative({ message: "Course price must be 0 or a positive number." }),
    isFree: z.boolean().optional(),
    couponCode: z.string().optional(),
    modules: z.array(moduleValidation).optional(),
  }),
});

// Validation schema for updating a course
const courseUpdateValidation = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    avatar: z.string().url({ message: "Invalid avatar URL format." }).optional(),
    duration: z.string().optional(),
    price: z.number().optional(),
    isFree: z.boolean().optional(),
    couponCode: z.string().optional(),
    modules: z.array(moduleValidation).optional(),
  }),
});

// Validation for assigning instructors to a course
const assignInstructorValidation = z.object({
  params: z.object({
    userId: z.string().nonempty({ message: "User ID is required." }).optional(),
  }),
});


// Validation for adding a review to a course
const addReviewValidation = z.object({
  body: z.object({
    review: z.string().nonempty({ message: "Review content is required." }),
    rating: z.number().min(1).max(5).nonnegative({ message: "Rating must be between 1 and 5." }),
  }),
});

// Validation for adding a comment to a course
const addCommentValidation = z.object({
  body: z.object({
    comment: z.string().nonempty({ message: "Comment content is required." }),
  }),
});

// Validation for creating a module
const createModuleValidation = z.object({
  body: z.object({
    title: z.string().nonempty({ message: "Module title is required." }),
    description: z.string().optional(),
    contents: z.array(contentValidation),
  }),
});

// Validation for creating content
const createContentValidation = z.object({
  body: contentValidation,
});


const addInstructorsACourse = z.object({
  body: z.object({
    instructorIds: z.array(z.string().nonempty({ message: "Instructor ID cannot be empty." })).nonempty({
      message: "At least one instructor ID is required.",
    }),
  }),
  params: z.object({
    courseId: z.string().nonempty({ message: "Course ID is required." }),
  }),
});

export const CourseValidations = {
  courseCreationValidation,
  courseUpdateValidation,
  assignInstructorValidation,
  addReviewValidation,
  addCommentValidation,
  createModuleValidation,
  createContentValidation,
  addInstructorsACourse
};
