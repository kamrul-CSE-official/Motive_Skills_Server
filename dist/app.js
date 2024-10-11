"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// import compression from "compression";
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// import responseTime from 'response-time';
// import mongoSanitize from 'express-mongo-sanitize';
// import serveStatic from 'serve-static';
// import globalErrorHandler from "./middlewares/globalErrorHandler";
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const user_route_1 = require("./modules/user/user.route");
const course_route_1 = require("./modules/courses/course.route");
const app = (0, express_1.default)();
// Rate Limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 20 * 60 * 1000, // 20 minutes
    max: 2000, // Limit each IP to 2000 requests per windowMs
});
// CORS Configuration
const corsOptions = {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
// Apply Middleware
app.use((0, cors_1.default)(corsOptions));
// app.use(compression());
app.use((0, helmet_1.default)());
// app.use(responseTime());
// app.use(mongoSanitize());
app.use(limiter);
// Static File Serving with Caching
/*
app.use(
  serveStatic("public", {
    maxAge: "1d",
    immutable: true,
  })
);
*/
// Parsers
// app.use(express.json({ limit: "170kb" })); 
// Routes
app.use("/api/v1/users", user_route_1.UserRoutes);
app.use("/api/v1/courses", course_route_1.courseRoutes);
// Root Route
app.get("/", (req, res) => {
    res.send("Motive skill server is running.");
});
// Global Error Handler
// app.use(globalErrorHandler);
// Not Found Handler
app.use(notFound_1.default);
exports.default = app;
