import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.JWT;

  try {
    if (token) {
      jwt.verify(
        token,
        process.env.SECRET_KEY as string,
        (err: any, decodedToken: any) => {
          if (err) {
            console.error(err);
            res.status(401).redirect("/LoginPage"); // Redirect to login page on token verification failure
          } else {
            next(); // Proceed to the next middleware if token is valid
          }
        }
      );
    } else {
      res.status(401).redirect("/LoginPage"); // Redirect to login page if no token is provided
    }
  } catch (error) {
    console.error(`Middleware error: ${error}`);
    res.status(500).send("Internal Server Error");
  }
};

export const redirectToDashboardIfAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.JWT;

  if (token) {
    return res.redirect("/Login");
  }

  next();
};
