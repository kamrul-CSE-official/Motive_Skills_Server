import express, { Request, Response } from "express";
import cors from "cors";
// import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
// import responseTime from 'response-time';
// import mongoSanitize from 'express-mongo-sanitize';
// import serveStatic from 'serve-static';

// import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import { UserRoutes } from "./modules/user/user.route";
import { courseRoutes } from "./modules/courses/course.route";

const app = express();

// Rate Limiting
const limiter = rateLimit({
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
app.use(cors(corsOptions));
// app.use(compression());
app.use(helmet());
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
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/courses", courseRoutes);

// Root Route
app.get("/", (req: Request, res: Response) => {
  res.send("Motive skill server is running.");
});

// Global Error Handler
// app.use(globalErrorHandler);

// Not Found Handler
app.use(notFound);

export default app;
