"use strict";
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
exports.UserServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("./user.model"));
const user_constants_1 = require("./user.constants");
const registerUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, avatar } = payload;
    const existingUser = yield user_model_1.default.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists with this email');
    }
    const newUser = new user_model_1.default({
        name,
        email,
        password,
        avatar
    });
    return yield newUser.save();
});
const loginUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, accessToken } = payload;
        const user = yield user_model_1.default.findOne({ email }).select("+password +role +accessTokens");
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(user._id, { $push: { accessTokens: accessToken } }, { new: true });
        if (!updatedUser) {
            throw new Error("Failed to update user with access token");
        }
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        return userWithoutPassword;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
const logoutService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accessToken } = payload;
        yield user_model_1.default.updateOne({ accessTokens: accessToken }, { $pull: { accessTokens: accessToken } });
    }
    catch (error) {
        throw new Error(`Failed to logout: ${(error === null || error === void 0 ? void 0 : error.message) || "!"}`);
    }
});
// user profile service
const profileService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(userId).select("-accessTokens +role");
        return user;
    }
    catch (error) {
        throw new Error(`Unable to fetch user profile: ${error.message}`);
    }
});
// search user service
const searchUsersService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // Define regex to match the search query
    const searchRegex = new RegExp(query, 'i'); // 'i' for case-insensitive
    // Perform search on 'name' and 'email' fields
    return yield user_model_1.default.find({
        $or: [
            { name: { $regex: searchRegex } },
            { email: { $regex: searchRegex } }
        ]
    }).select('-accessTokens');
});
// search user service
const userInstructorsService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.default.find({ role: user_constants_1.userRole[4] });
});
// Search instructor service
const searchInstructorService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const searchRegex = new RegExp(query, 'i');
    return yield user_model_1.default.find({
        role: user_constants_1.userRole[4],
        $or: [
            { name: { $regex: searchRegex } },
            { email: { $regex: searchRegex } }
        ]
    }).select('-accessTokens +role');
});
// Create instructor service
const createInstructorService = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(_id, { role: user_constants_1.userRole[4] }, { new: true, runValidators: true });
        // Check if the user was found and updated
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }
    catch (error) {
        throw new Error(`Failed to update user role: ${error.message}`);
    }
});
exports.UserServices = {
    registerUserService,
    loginUserService,
    logoutService,
    profileService,
    searchUsersService,
    userInstructorsService,
    searchInstructorService,
    createInstructorService
};
