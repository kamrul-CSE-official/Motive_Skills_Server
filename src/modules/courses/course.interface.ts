import mongoose, { Document } from "mongoose";

// IContent interface for individual content within a module
export interface IContent extends Document {
    id?: string; // UUID for content, not mandatory
    type: 'video' | 'text' | 'assignment'; // Type of content
    title: string; // Content title
    videoUrl?: string; // Only for 'video' type
    text?: string; // Only for 'text' type
    assignment?: string; // Only for 'assignment' type
    description?: string; // Optional description for the content
    content: string; // The main body of content (for text and assignment types)
    isPublic: boolean; // If the content is public or private
}

// IModule interface for each module within a course
export interface IModule extends Document {
    _id?: mongoose.Schema.Types.ObjectId | string; // MongoDB ObjectId or string (used for auto-generation)
    id?: string; // Optional UUID for the module
    title: string; // Title of the module
    description?: string; // Optional description for the module
    contents?: IContent[]; // Array of contents belonging to the module
}

// IReview interface for course reviews
export interface IReview extends Document {
    userId: mongoose.Types.ObjectId; 
    rating: number; // Example field
    comment: string; // Example field
}

// IComment interface for course comments
export interface IComment extends Document {
    userId: mongoose.Types.ObjectId; 
    content: string;
    createdAt?: Date;
}

// ICourse interface for a course document
export interface ICourse extends Document {
    title: string; // Title of the course
    description: string; // Description of the course
    instructors?: mongoose.Types.ObjectId[]; // References to the instructors (User model)
    avatar: string; // Course avatar URL
    duration: string; // Duration of the course (e.g., "10 hours")
    price: number; // Price of the course, `0` if the course is free
    isFree: boolean; // Indicates if the course is free or not
    couponCodes?: { key: string; discount: number }[]; // Optional coupon code for discounts
    modules?: IModule[]; // Array of modules for the course
    studentsEnrolled?: mongoose.Types.ObjectId[]; // Array of User ObjectIds (students enrolled)
    authorizedInstructors?: mongoose.Types.ObjectId[]; // Array of User ObjectIds (other authorized instructors)
    reviews?: IReview[]; // Array of reviews for the course
    comments?: IComment[]; // Array of comments for the course
    createdAt?: Date; // Automatically set by Mongoose
    updatedAt?: Date; // Automatically set by Mongoose
}
