import { z } from "zod";

// Define the validation schema for user registration
export const userRegistrationValidations = z.object({
  body: z.object({
    name: z.string().nonempty('Name is required'), 
    email: z.string().email('Invalid email address').nonempty('Email is required'), 
    password: z.string().nonempty('Password is required'), 
    avatar: z.string().url().optional(), 
  }),
});

export const userLoginValidations = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').nonempty('Email is required'), 
    password: z.string().nonempty('Password is required'), 
  }),
});

export const userLogoutValidations = z.object({
  body: z.object({
    accessToken: z.string(), 
  }),
});




export const UserValidations = {
  userRegistrationValidations,
  userLoginValidations,
  userLogoutValidations
};
