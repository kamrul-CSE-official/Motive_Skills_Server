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
exports.catchAsync = void 0;
const config_1 = __importDefault(require("../config"));
const catchAsync = (fn) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield fn(req, res, next);
        }
        catch (error) {
            // Log the error with more context
            // console.error("Error caught in catchAsync:", {
            //   message: (error as Error)?.message,
            //   stack: (error as Error)?.stack,
            //   route: req.originalUrl,
            //   method: req.method,
            // });
            // Determine the status code (defaulting to 500 for server errors)
            const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
            // Send a more detailed error response
            res.status(statusCode).json({
                success: false,
                message: "An unexpected error occurred.",
                error: {
                    message: (error === null || error === void 0 ? void 0 : error.message) || "Unknown error",
                    stack: config_1.default.NODE_ENV === "development"
                        ? error === null || error === void 0 ? void 0 : error.stack
                        : undefined, // Hide stack trace in production
                    route: req.originalUrl,
                    method: req.method,
                },
            });
            // Forward the error to the next middleware, such as a global error handler
            next(error);
        }
    });
};
exports.catchAsync = catchAsync;
