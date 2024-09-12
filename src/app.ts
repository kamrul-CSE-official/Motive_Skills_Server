import express, { Request, Response } from "express";
import cors from "cors"; 
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import { UserRoutes } from "./modules/user/user.route";
import { CourseRoutes } from "./modules/courses/course.route";

const app = express();

// Configure CORS
const corsOptions = {
  origin: ["http://localhost:3000"], 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, 
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Parsers
app.use(express.json());

// Routes
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/courses", CourseRoutes);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Motive skill server is running.");
});

// Global error handler
app.use(globalErrorHandler);

// Not Found
app.use(notFound);

export default app;
