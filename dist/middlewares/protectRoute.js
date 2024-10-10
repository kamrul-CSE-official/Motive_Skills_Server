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
exports.protectRoute = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const user_model_1 = __importDefault(require("../modules/user/user.model"));
// Middleware to verify role-based access
const protectRoute = (requiredRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res
                    .status(401)
                    .json({ message: "Authorization header missing or invalid" });
            }
            const token = authHeader.split(" ")[1];
            try {
                // Use jwt.verify to decode the token and specify JwtPayload as the return type
                const decoded = jsonwebtoken_1.default.verify(token, config_1.default.auth.accessTokenSecret);
                // Find user by the decoded ID and select the required fields
                const user = (yield user_model_1.default.findById(decoded._id).select("+role +accessTokens"));
                if (!user) {
                    return res.status(401).json({ message: "User not found" });
                }
                // Ensure that accessTokens is defined and includes the token
                if (!user.accessTokens || !user.accessTokens.includes(token)) {
                    return res.status(401).json({ message: "Invalid access token" });
                }
                // Check if the user role is among the required roles
                if (!requiredRoles.includes(user.role)) {
                    return res
                        .status(403)
                        .json({
                        message: "You do not have permission to access this resource",
                    });
                }
                // Attach the user to the request object for use in the next middleware or route handler
                req.user = user;
                next();
            }
            catch (error) {
                if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                    // Token has expired, remove it from the user's accessTokens array
                    const user = yield user_model_1.default.findOneAndUpdate({ accessTokens: token }, { $pull: { accessTokens: token } }, { new: true });
                    if (!user) {
                        return res.status(401).json({ message: "User not found" });
                    }
                    // Save the updated user document
                    yield user.save();
                    return res
                        .status(401)
                        .json({ message: "Access token has expired, please log in again" });
                }
                // For other errors, return a generic error response
                return res.status(500).json({ message: "Internal server error" });
            }
        }
        catch (error) {
            console.log("Error in protectRoute middleware:", error.message);
            res.status(500).json({ message: "Internal server error" });
        }
    });
};
exports.protectRoute = protectRoute;
