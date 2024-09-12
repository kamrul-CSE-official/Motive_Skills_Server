import mongoose, { Schema } from "mongoose";
import { ICoupon } from "./coupon.interface";

const CouponSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    discountType: {
      type: String,
      enum: ["percentage", "fixed", "free"],
      required: true,
    },
    discountValue: { type: Number }, // Value in percentage or fixed amount
    applicableCourses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    ],
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICoupon>("Coupon", CouponSchema);
