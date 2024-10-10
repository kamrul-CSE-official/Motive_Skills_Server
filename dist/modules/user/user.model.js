"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const date_fns_1 = require("date-fns");
const config_1 = __importDefault(require("../../config"));
const user_constants_1 = require("./user.constants");
// Create the User schema
const UserSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: true, auto: true },
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
    role: { type: String, enum: user_constants_1.userRole, default: "user", select: false },
    avatar: { type: String },
    coursesEnrolled: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Course", select: false }],
    dateJoined: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    subscriptions: [{
            course: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Course', required: true },
            type: { type: String, enum: user_constants_1.subscriptionTypes },
            duration: { type: String, enum: user_constants_1.subscriptionDurations },
            startDate: { type: Date },
            endDate: { type: Date },
        }],
    couponsUsed: { type: [String], select: false },
    accessTokens: [{ type: String }],
}, { timestamps: true });
// Middleware to hash password before saving
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password') && this.password) {
            try {
                const salt = yield bcrypt_1.default.genSalt(config_1.default.auth.salt_round || 5);
                this.password = yield bcrypt_1.default.hash(this.password, salt);
            }
            catch (error) {
                return next(error);
            }
        }
        // Automatically set startDate and endDate for each subscription
        if (this.isModified('subscriptions') && this.subscriptions) {
            this.subscriptions.forEach((subscription) => {
                subscription.startDate = subscription.startDate || new Date();
                if (subscription.duration === '6-months') {
                    subscription.endDate = (0, date_fns_1.addMonths)(subscription.startDate, 6);
                }
                else if (subscription.duration === '1-year') {
                    subscription.endDate = (0, date_fns_1.addYears)(subscription.startDate, 1);
                }
            });
        }
        next();
    });
});
// remove access tken from DB when user's role will change.
UserSchema.pre('save', function (next) {
    // Check if the role field has been modified
    if (this.isModified('role')) {
        // Clear access tokens when the role is changed
        this.accessTokens = [];
    }
    // Proceed with the save operation
    next();
});
exports.default = mongoose_1.default.model("User", UserSchema);
