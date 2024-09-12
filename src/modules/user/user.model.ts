import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { addMonths, addYears } from "date-fns";
import config from "../../config";
import {
  subscriptionDurations,
  subscriptionTypes,
  userRole,
} from "./user.constants";
import { IUser } from "./user.interface";

// Create the User schema
const UserSchema: Schema<IUser> = new Schema(
  {
    _id: {type: mongoose.Types.ObjectId, required: true, auto: true},
    name: { type: String, required: [true, "Name is required!"] },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      select: false,
    },
    role: { type: String, enum: userRole, default: "user", select: false },
    avatar: { type: String },
    coursesEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course", select: false }],
    dateJoined: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    subscriptions: [{
      course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
      type: { type: String, enum: subscriptionTypes },
      duration: { type: String, enum: subscriptionDurations },
      startDate: { type: Date },
      endDate: { type: Date },
    }],
    couponsUsed: { type: [String], select: false },
    accessTokens: [{ type: String }],

  },
  { timestamps: true }
);

// Middleware to hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password') && this.password) {
    try {
      const salt = await bcrypt.genSalt(config.auth.salt_round || 5);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error as mongoose.CallbackError);
    }
  }

  // Automatically set startDate and endDate for each subscription
  if (this.isModified('subscriptions') && this.subscriptions) {
    this.subscriptions.forEach((subscription) => {
      subscription.startDate = subscription.startDate || new Date();

      if (subscription.duration === '6-months') {
        subscription.endDate = addMonths(subscription.startDate, 6);
      } else if (subscription.duration === '1-year') {
        subscription.endDate = addYears(subscription.startDate, 1);
      }
    });
  }

  next();
});

// remove access tken from DB when user's role will change.
UserSchema.pre<IUser>('save', function (next) {
  // Check if the role field has been modified
  if (this.isModified('role')) {
    // Clear access tokens when the role is changed
    this.accessTokens = [];
  }
  
  // Proceed with the save operation
  next();
});


export default mongoose.model<IUser>("User", UserSchema);
