import { NextFunction, Request, RequestHandler, Response } from "express";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error:unknown) {
      const errorMessage = (error as Error)?.message as string;
      res.status(500).json({
        success: false,
        message: "Something went wrong!",
        error: errorMessage, 
      });
      next(error); 
    }
  };
};
