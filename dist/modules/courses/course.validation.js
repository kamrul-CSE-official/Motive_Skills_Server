"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseValidations = void 0;
const zod_1 = require("zod");
// Best selling courses
const bestSellingCoursesValidation = zod_1.z.object({
    params: zod_1.z.object({
        limit: zod_1.z.string().optional(),
        page: zod_1.z.string().optional(),
    }),
});
// Content validation schema
const contentValidation = zod_1.z.object({
    type: zod_1.z.enum(["video", "text", "assignment"], {
        required_error: "Content type is required and must be one of: 'video', 'text', or 'assignment'.",
    }),
    videoUrl: zod_1.z.string().url("Invalid video URL format.").optional(),
    text: zod_1.z.string().optional(),
    assignment: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    title: zod_1.z.string().nonempty({ message: "Content title is required." }),
    content: zod_1.z.string().nonempty({ message: "Content body is required." }),
    isPublic: zod_1.z.boolean().optional(),
});
// Module validation schema
const moduleValidation = zod_1.z.object({
    title: zod_1.z.string().nonempty({ message: "Module title is required." }),
    description: zod_1.z.string().optional(),
    contents: zod_1.z.array(contentValidation),
});
// Course validation schema
const courseCreationValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().nonempty({ message: "Course title is required." }),
        description: zod_1.z
            .string()
            .nonempty({ message: "Course description is required." }),
        instructors: zod_1.z
            .array(zod_1.z.string().nonempty({ message: "Instructor ID cannot be empty." }))
            .nonempty({
            message: "At least one instructor ID is required.",
        }),
        avatar: zod_1.z
            .string()
            .url({ message: "Invalid avatar URL format." })
            .nonempty({ message: "Course avatar is required." }),
        duration: zod_1.z.string().nonempty({ message: "Course duration is required." }),
        price: zod_1.z
            .number()
            .nonnegative({ message: "Course price must be 0 or a positive number." }),
        isFree: zod_1.z.boolean().optional(),
        couponCode: zod_1.z.string().optional(),
        modules: zod_1.z.array(moduleValidation).optional(),
    }),
});
// Validation schema for updating a course
const courseUpdateValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        avatar: zod_1.z
            .string()
            .url({ message: "Invalid avatar URL format." })
            .optional(),
        duration: zod_1.z.string().optional(),
        price: zod_1.z.number().optional(),
        isFree: zod_1.z.boolean().optional(),
        couponCode: zod_1.z.string().optional(),
        modules: zod_1.z.array(moduleValidation).optional(),
    }),
});
// Validation for assigning instructors to a course
const assignInstructorValidation = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().nonempty({ message: "User ID is required." }).optional(),
    }),
});
// Validation for adding a review to a course
const addReviewValidation = zod_1.z.object({
    body: zod_1.z.object({
        comment: zod_1.z.string().nonempty({ message: "Comment is required!" }),
        rating: zod_1.z
            .number()
            .min(1)
            .max(5)
            .nonnegative({ message: "Rating must be between 1 and 5." }),
    }),
    params: zod_1.z.object({
        courseId: zod_1.z.string().nonempty({ message: "Course Id is required!" }),
    }),
});
// Validation for adding a queries to a course
const addQueriesValidation = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().nonempty({ message: "Comment content is required." }),
        replay: zod_1.z.string().optional(),
    }),
    params: zod_1.z.object({
        courseId: zod_1.z.string().nonempty({ message: "Course Id is required!" }),
    }),
});
// Validation for creating a module
const createModuleValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().nonempty({ message: "Module title is required." }),
        description: zod_1.z.string().optional(),
        contents: zod_1.z.array(contentValidation),
    }),
    params: zod_1.z.object({
        courseId: zod_1.z.string().nonempty({ message: "Course ID is required!" }),
    }),
});
// Validation for creating content
const createContentValidation = zod_1.z.object({
    body: contentValidation,
    params: zod_1.z.object({
        moduleId: zod_1.z.string().nonempty({ message: "Module id is required!" }),
        courseId: zod_1.z.string().nonempty({ message: "Course id is required!" }),
    }),
});
const addInstructorsACourse = zod_1.z.object({
    body: zod_1.z.object({
        instructorIds: zod_1.z
            .array(zod_1.z.string().nonempty({ message: "Instructor ID cannot be empty." }))
            .nonempty({
            message: "At least one instructor ID is required.",
        }),
    }),
    params: zod_1.z.object({
        courseId: zod_1.z.string().nonempty({ message: "Course ID is required." }),
    }),
});
const deleteCourseValidation = zod_1.z.object({
    params: zod_1.z.object({
        courseId: zod_1.z.string().nonempty({ message: "Course Id is required!" }),
    }),
});
const deleteMoluleValidation = zod_1.z.object({
    params: zod_1.z.object({
        moduleId: zod_1.z.string().nonempty({ message: "Module Id is required!" }),
        courseId: zod_1.z.string().nonempty({ message: "Course Id is required!" }),
    }),
});
const deleteContantValidation = zod_1.z.object({
    params: zod_1.z.object({
        contentId: zod_1.z.string().nonempty({ message: "Content Id is required!" }),
        moduleId: zod_1.z.string().nonempty({ message: "Module Id is required!" }),
        courseId: zod_1.z.string().nonempty({ message: "Course Id is required!" }),
    }),
});
exports.CourseValidations = {
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
