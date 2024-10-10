import { ErrorRequestHandler, NextFunction } from "express";
import { TErrorSources } from "../interface/error.interface";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError from "../errors/AppError";
import config from "../config";

const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next: NextFunction
) => {
  // Default error details
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: TErrorSources = [];

  // Handling known error types
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err?.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err?.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    // For generic JS errors
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  // Send the response
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    // Only send stack trace in development mode
    stack: config.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
