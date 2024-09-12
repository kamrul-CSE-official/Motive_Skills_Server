import mongoose, { Document } from "mongoose";

export interface IEnrollment extends Document {
    user: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    enrollmentDate: Date;
    expiryDate: Date;
    isActive: boolean;
}