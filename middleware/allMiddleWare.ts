import { Request, Response, NextFunction } from "express";
import { CustomError } from "./customError";

const castError = (err: any) => {
  const message = `Invalid Value ${err.value} for field ${err.path}`;
  new CustomError(message, 404);
};
const duplicateKeyError = (err: any) => {
  const name = err.keyValue.name;
  const msg = `There is already a same value with the value you are providing ${name} please use another value`;

  return new CustomError(msg, 400);
};

const ValidationError = (err: any) => {
  const er = Object.values(err.errors).map((error: any) => error.message);
  const errorMessages = er.join(". ");
  const msg = `Invalid input data ${errorMessages}`;
  return new CustomError(msg, 404);
};
export const ERRMID = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_DEV === "development") {
    if (error.name === "CastError") {
      error = castError(error);
    }
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
      stackTrace: error.stackTrace,
      error: error,
    });
  } else {
    if (error.name === "CastError") {
      error = castError(error);
    }
    if (error.code === 11000) {
      error = duplicateKeyError(error);
    }

    if (error.name === "ValidationError") {
      error = ValidationError(error);
    }
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  }
};
