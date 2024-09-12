import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.services";
import { createAccessToken } from "../../utils/jwt.services";
import User from "./user.model";
import { uploadImage } from "../../utils/uploadImage";
import mongoose from "mongoose";

// Register Controller
const registerController = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, avatar } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "User already exists with this email" });
  }

  let avatarUrl = "";
  if (req.file) {
    avatarUrl = await uploadImage(req.file) || "";
  }

  const userData = {
    name,
    email,
    password,
    avatar: avatarUrl || avatar,
  };

  const newUser = await UserServices.registerUserService(userData);

  res.status(201).json({
    message: "User registered successfully",
    user: newUser,
  });
});

// Login Controller
const loginController = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Verify user existence
  const user = await User.findOne({ email }).select("+role");

  if (!user) {
    return res.status(401).json({ message: "User does not exist!" });
  }

  // Create an access token
  const accessToken = createAccessToken({
    _id: user?._id as mongoose.Types.ObjectId | string, 
    name: user.name,
    email: user.email,
    avatar: user.avatar || "",
    role: user.role,
  });

  // Validate user password
  const isPasswordValid = await UserServices.loginUserService({
    email,
    password,
    accessToken
  });

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      accessToken: accessToken,
    });
  
});


// Logout Controller
const logoutController = catchAsync(async (req: Request, res: Response) => {
  const accessToken =
    req.headers.authorization?.split(" ")[1] ||
    req.body.accessToken?.split(" ")[1];

  if (!accessToken) {
    return res.status(400).json({ message: "Access token is required" });
  }

  await UserServices.logoutService({ accessToken });

  return res.status(200).json({ message: "Logout successful" });
});

// User profile Controller
const userProfileController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?._id as mongoose.Types.ObjectId | string;
    const user = await UserServices.profileService(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  }
);

// Search user
const searchUsersController = catchAsync(async (req: Request, res: Response) => {
  const query = req.query.query as string;
  const users = await UserServices.searchUsersService(query);
  res.status(200).json({data:users, message: "Search reasult get successfully."});
  }
)

// Get all Instructors
const instructorController = catchAsync(async (req: Request, res: Response) => {
  const instructors = await UserServices.userInstructorsService();
  res.status(200).json({data:instructors, message: "Instructors get successfully."});
  }
)


// Search instructor user
const searchInstructorsController = catchAsync(async (req: Request, res: Response) => {
  const query = req.query.query as string;
  const users = await UserServices.searchInstructorService(query);
  res.status(200).json({data:users, message: "Search reasult get successfully."});
  }
);


// Create instructor 
const createInstructorController = catchAsync(async (req: Request, res: Response) => {
  const query = req.query._id as string;
  const users = await UserServices.createInstructorService(query);
  res.status(200).json({data:users, message: "Create instructor successfully."});
  }
)

export const userControllers = {
  registerController,
  loginController,
  logoutController,
  userProfileController,
  searchUsersController,
  instructorController,
  searchInstructorsController,
  createInstructorController
};
