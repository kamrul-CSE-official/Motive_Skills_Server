import bcrypt from "bcrypt";
import { IUser } from "./user.interface";
import User from "./user.model";
import { userRole } from "./user.constants";
import mongoose from "mongoose";

interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

interface LoginUserPayload {
  email: string;
  password: string;
  accessToken: string
}

const registerUserService = async (payload: RegisterUserPayload): Promise<IUser> => {
  const { name, email, password, avatar } = payload;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  const newUser = new User({
    name,
    email,
    password,
    avatar
  });

  return await newUser.save();
};

const loginUserService = async (payload: LoginUserPayload): Promise<Omit<IUser, "password"> | null> => {
  try {
    const { email, password, accessToken } = payload;
    const user = await User.findOne({ email }).select("+password +role +accessTokens");

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password as string);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { accessTokens: accessToken } },
      { new: true }
    );
    if (!updatedUser) {
      throw new Error("Failed to update user with access token");
    }
    

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return userWithoutPassword as Omit<IUser, "password">;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};



const logoutService = async (payload: { accessToken: string }): Promise<void> => {
  try {
    const { accessToken } = payload;
     await User.updateOne(
      { accessTokens: accessToken },
      { $pull: { accessTokens: accessToken } }
    );
   
  } catch (error) {
    throw new Error(`Failed to logout: ${(error as Error)?.message || "!"}`);
  }
};


// user profile service
const profileService = async (userId: string | mongoose.Types.ObjectId): Promise<IUser | null> =>{
  try {
    const user = await User.findById(userId).select("-accessTokens +role");
    return user;
  } catch (error) {
    throw new Error(`Unable to fetch user profile: ${(error as Error).message}`);
  }
}

// search user service
const searchUsersService = async (query: string) => {
  // Define regex to match the search query
  const searchRegex = new RegExp(query, 'i'); // 'i' for case-insensitive

  // Perform search on 'name' and 'email' fields
  return await User.find({
    $or: [
      { name: { $regex: searchRegex } },
      { email: { $regex: searchRegex } }
    ]
  }).select('-accessTokens');
};


// search user service
const userInstructorsService = async () => {
  return await User.find({ role: userRole[4]});
};


// Search instructor service
const searchInstructorService = async (query: string) => {
  const searchRegex = new RegExp(query, 'i'); 

  return await User.find({
    role: userRole[4],
    $or: [
      { name: { $regex: searchRegex } },
      { email: { $regex: searchRegex } }
    ]
  }).select('-accessTokens +role');
};

// Create instructor service
const createInstructorService = async (_id: string) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id, 
      { role: userRole[4] }, 
      { new: true, runValidators: true } 
    );

    // Check if the user was found and updated
    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to update user role: ${(error as Error).message}`);
  }
};



export const UserServices = {
  registerUserService,
  loginUserService,
  logoutService,
  profileService,
  searchUsersService,
  userInstructorsService,
  searchInstructorService,
  createInstructorService
};
