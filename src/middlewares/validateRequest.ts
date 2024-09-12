import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { catchAsync } from "../utils/catchAsync";

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = await schema.parseAsync({
      body: req.body,
      params: req.params, // Add params here
      query: req.query, // You can also validate query params if needed
    });

    // Update req with the parsed and validated data
    req.body = parsedData.body;
    req.params = parsedData.params;
    req.query = parsedData.query;

    next();
  });
};

export default validateRequest;
