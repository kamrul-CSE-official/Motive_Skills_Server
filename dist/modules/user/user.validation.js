"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = exports.userLogoutValidations = exports.userLoginValidations = exports.userRegistrationValidations = void 0;
const zod_1 = require("zod");
// Define the validation schema for user registration
exports.userRegistrationValidations = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().nonempty('Name is required'),
        email: zod_1.z.string().email('Invalid email address').nonempty('Email is required'),
        password: zod_1.z.string().nonempty('Password is required'),
        avatar: zod_1.z.string().url().optional(),
    }),
});
exports.userLoginValidations = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address').nonempty('Email is required'),
        password: zod_1.z.string().nonempty('Password is required'),
    }),
});
exports.userLogoutValidations = zod_1.z.object({
    body: zod_1.z.object({
        accessToken: zod_1.z.string(),
    }),
});
exports.UserValidations = {
    userRegistrationValidations: exports.userRegistrationValidations,
    userLoginValidations: exports.userLoginValidations,
    userLogoutValidations: exports.userLogoutValidations
};
