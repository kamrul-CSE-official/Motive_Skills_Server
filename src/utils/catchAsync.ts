import { NextFunction, Request, RequestHandler, Response } from "express";
import config from "../config";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: unknown) {
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
          message: (error as Error)?.message || "Unknown error",
          stack:
            config.NODE_ENV === "development"
              ? (error as Error)?.stack
              : undefined, // Hide stack trace in production
          route: req.originalUrl,
          method: req.method,
        },
      });

      // Forward the error to the next middleware, such as a global error handler
      next(error);
    }
  };
};
