import { z } from "zod";

// Best selling courses
const bestSellingCoursesValidation = z.object({
  params: z.object({
    limit: z.string().optional(),
    page: z.string().optional(),
  }),
})

// Content validation schema
const contentValidation = z.object({
  type: z.enum(["video", "text", "assignment"], {
    required_error:
      "Content type is required and must be one of: 'video', 'text', or 'assignment'.",
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
    description: z
      .string()
      .nonempty({ message: "Course description is required." }),
    instructors: z
      .array(z.string().nonempty({ message: "Instructor ID cannot be empty." }))
      .nonempty({
        message: "At least one instructor ID is required.",
      }),
    avatar: z
      .string()
      .url({ message: "Invalid avatar URL format." })
      .nonempty({ message: "Course avatar is required." }),
    duration: z.string().nonempty({ message: "Course duration is required." }),
    price: z
      .number()
      .nonnegative({ message: "Course price must be 0 or a positive number." }),
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
    avatar: z
      .string()
      .url({ message: "Invalid avatar URL format." })
      .optional(),
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
    comment: z.string().nonempty({ message: "Comment is required!" }),
    rating: z
      .number()
      .min(1)
      .max(5)
      .nonnegative({ message: "Rating must be between 1 and 5." }),
  }),
  params: z.object({
    courseId: z.string().nonempty({ message: "Course Id is required!" }),
  }),
});

// Validation for adding a queries to a course
const addQueriesValidation = z.object({
  body: z.object({
    content: z.string().nonempty({ message: "Comment content is required." }),
    replay: z.string().optional(),
  }),
  params: z.object({
    courseId: z.string().nonempty({ message: "Course Id is required!" }),
  }),
});

// Validation for creating a module
const createModuleValidation = z.object({
  body: z.object({
    title: z.string().nonempty({ message: "Module title is required." }),
    description: z.string().optional(),
    contents: z.array(contentValidation),
  }),
  params: z.object({
    courseId: z.string().nonempty({ message: "Course ID is required!" }),
  }),
});

// Validation for creating content
const createContentValidation = z.object({
  body: contentValidation,
  params: z.object({
    moduleId: z.string().nonempty({ message: "Module id is required!" }),
    courseId: z.string().nonempty({ message: "Course id is required!" }),
  }),
});

const addInstructorsACourse = z.object({
  body: z.object({
    instructorIds: z
      .array(z.string().nonempty({ message: "Instructor ID cannot be empty." }))
      .nonempty({
        message: "At least one instructor ID is required.",
      }),
  }),
  params: z.object({
    courseId: z.string().nonempty({ message: "Course ID is required." }),
  }),
});

const deleteCourseValidation = z.object({
  params: z.object({
    courseId: z.string().nonempty({ message: "Course Id is required!" }),
  }),
});

const deleteMoluleValidation = z.object({
  params: z.object({
    moduleId: z.string().nonempty({ message: "Module Id is required!" }),
    courseId: z.string().nonempty({ message: "Course Id is required!" }),
  }),
});

const deleteContantValidation = z.object({
  params: z.object({
    contentId: z.string().nonempty({ message: "Content Id is required!" }),
    moduleId: z.string().nonempty({ message: "Module Id is required!" }),
    courseId: z.string().nonempty({ message: "Course Id is required!" }),
  }),
});

export const CourseValidations = {
  bestSellingCoursesValidation,
  courseCreationValidation,
  courseUpdateValidation,
  assignInstructorValidation,
  deleteCourseValidation,
  deleteMoluleValidation,
  deleteContantValidation,
  addReviewValidation,
  addQueriesValidation,
  createModuleValidation,
  createContentValidation,
  addInstructorsACourse,
};
