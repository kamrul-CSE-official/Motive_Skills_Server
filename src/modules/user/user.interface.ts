import mongoose, { Document } from "mongoose";
import { SubscriptionDuration, SubscriptionType, UserRole } from "./user.constants";

export interface Subscription {
  course: mongoose.Types.ObjectId;
  type: SubscriptionType;
  duration: SubscriptionDuration;
  startDate: Date;
  endDate: Date;
}

export interface IUser extends Document {
  _id?: mongoose.Types.ObjectId 
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  coursesEnrolled?: mongoose.Types.ObjectId[];
  dateJoined: Date;
  isActive: boolean;
  subscriptions?: Subscription[];
  couponsUsed?: string[];
  accessTokens?: string[]
}



