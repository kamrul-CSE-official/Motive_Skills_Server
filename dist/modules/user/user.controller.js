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
exports.userControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const user_services_1 = require("./user.services");
const jwt_services_1 = require("../../utils/jwt.services");
const user_model_1 = __importDefault(require("./user.model"));
const uploadImage_1 = require("../../utils/uploadImage");
// Register Controller
const registerController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, avatar } = req.body;
    const existingUser = yield user_model_1.default.findOne({ email });
    if (existingUser) {
        return res
            .status(409)
            .json({ message: "User already exists with this email" });
    }
    let avatarUrl = "";
    if (req.file) {
        avatarUrl = (yield (0, uploadImage_1.uploadImage)(req.file)) || "";
    }
    const userData = {
        name,
        email,
        password,
        avatar: avatarUrl || avatar,
    };
    const newUser = yield user_services_1.UserServices.registerUserService(userData);
    res.status(201).json({
        message: "User registered successfully",
        user: newUser,
    });
}));
// Login Controller
const loginController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Verify user existence
    const user = yield user_model_1.default.findOne({ email }).select("+role");
    if (!user) {
        return res.status(401).json({ message: "User does not exist!" });
    }
    // Create an access token
    const accessToken = (0, jwt_services_1.createAccessToken)({
        _id: user === null || user === void 0 ? void 0 : user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        role: user.role,
    });
    // Validate user password
    const isPasswordValid = yield user_services_1.UserServices.loginUserService({
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
}));
// Logout Controller
const logoutController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const accessToken = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) ||
        ((_b = req.body.accessToken) === null || _b === void 0 ? void 0 : _b.split(" ")[1]);
    if (!accessToken) {
        return res.status(400).json({ message: "Access token is required" });
    }
    yield user_services_1.UserServices.logoutService({ accessToken });
    return res.status(200).json({ message: "Logout successful" });
}));
// User profile Controller
const userProfileController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
    const user = yield user_services_1.UserServices.profileService(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
}));
// Search user
const searchUsersController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.query;
    const users = yield user_services_1.UserServices.searchUsersService(query);
    res.status(200).json({ data: users, message: "Search reasult get successfully." });
}));
// Get all Instructors
const instructorController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const instructors = yield user_services_1.UserServices.userInstructorsService();
    res.status(200).json({ data: instructors, message: "Instructors get successfully." });
}));
// Search instructor user
const searchInstructorsController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.query;
    const users = yield user_services_1.UserServices.searchInstructorService(query);
    res.status(200).json({ data: users, message: "Search reasult get successfully." });
}));
// Create instructor 
const createInstructorController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query._id;
    const users = yield user_services_1.UserServices.createInstructorService(query);
    res.status(200).json({ data: users, message: "Create instructor successfully." });
}));
exports.userControllers = {
    registerController,
    loginController,
    logoutController,
    userProfileController,
    searchUsersController,
    instructorController,
    searchInstructorsController,
    createInstructorController
};
