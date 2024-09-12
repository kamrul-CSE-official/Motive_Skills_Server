import mongoose, { Document } from "mongoose";

export interface ICoupon extends Document {
    code: string;
    discountType: 'percentage' | 'fixed' | 'free';
    discountValue?: number; // Applicable if discountType is 'percentage' or 'fixed'
    applicableCourses?: mongoose.Types.ObjectId[]; // If null, coupon can be applied to all courses
    expiryDate: Date;
    isActive: boolean;
}