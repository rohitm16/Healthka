import { NextFunction, Request, Response } from "express";
import { CustomError } from "./customError";

const castError = (error: any) => {
  const msg = `Invalid value${error.value} for field ${error.field}`;
  new CustomError(msg, 404);
};

const duplicateKey = (error: any, next: NextFunction) => {
  const msg = `This name is already taken ${error.keyValue.name}`;
  const customError = new CustomError(msg, 404);
  next(customError);
};

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customError = new CustomError("An unexpected error occurred", 500);

  if (process.env.NODE_ENV === "development") {
    console.error("what is this", customError); // Log the error in development mode
    res.status(customError.statusCode || 500).json({
      status: customError.status,
      message: customError.message,
      statusCode: customError.statusCode,
      stackTrace: customError.stack,
    });
  } else if (process.env.NODE_ENV === "production") {
    if (customError.name === "CastError") {
      customError.statusCode = 400; // Bad Request
      customError.message = `Invalid value ${error.value} for field ${error.path}`;
    } else if (customError.name === "MongoError") {
      customError.statusCode = 400; // Bad Request
      customError.message = `Duplicate key error: ${error.keyValue.name}`;
    } else if (customError.name === "ValidationError") {
      customError.statusCode = 400; // Bad Request
      customError.message = `Invalid input data`;
    }

    res.setHeader("Content-Type", "application/json"); // Set content type to JSON
    res.status(customError.statusCode || 500).json({
      status: customError.status,
      message: customError.message,
      statusCode: customError.statusCode,
    });
  }
};
