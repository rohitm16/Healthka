import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { connectToDatabase } from "./config/config";
import mysql_pool from "./config/mysqlConfig";
import DocRouter from "./api/doctorProfile";
import serviceRouter from "./api/serviceProfile";
import recordsRouter from "./api/recordsProfile";
import patientProfile from "./api/PatientProfile";
import RecepRouter from "./api/receptionistProfile";
import cookieParser from "cookie-parser";

import doctor_profile_service from "./services/doctorProfileService";
import { CustomError } from "./middleware/customError";
import { errorHandler } from "./middleware/globalErrorHandler";
import predictionApi from "./api/predictionApi";

import { error } from "console";
import { ERRMID } from "./middleware/allMiddleWare";

dotenv.config();
process.on("uncaughtException", (error: any) => {
  console.error(error.name, error.message);
  console.error("Uncaught exception occurred. Exiting process...");
  process.exit(1);
});

const app = express();
const servers = http.createServer(app);
app.use(express.json());
const port = process.env.APP_PORT || 4000;
const service = new doctor_profile_service();

app.use(cookieParser());
app.use(bodyParser.json());
app.set("trust proxy", 1);
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://www.healthka.life"
        : "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/v1/doctors", DocRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/records", recordsRouter);
app.use("/api/v1/patient", patientProfile);
app.use("/api/v1/prediction", predictionApi);
app.use("/api/v1/receptionist", RecepRouter);
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new CustomError(`Can't find ${req.originalUrl} on server`, 400);
  next(err);
});

app.use(ERRMID);

const Porting = port || 8001;

// Start the HTTP server
servers.listen(Porting, async () => {
  try {
    console.log("server up and running on PORT : ", Porting);
    await connectToDatabase(); // Assuming connectToDatabase() is an async function
    // mysql_pool; // This line seems unnecessary here, remove it if not needed
  } catch (error: any) {
    // Check if the error is 'getaddrinfo ENOTFOUND'
    if (error.code === "ENOTFOUND") {
      console.error(error.name, error.message);
      console.error("DNS resolution failed. Exiting process...");
      process.exit(1);
    } else {
      // Handle other types of errors
      console.error("An error occurred:", error);
      process.exit(1);
    }
  }
});

process.on("unhandledRejection", (error: any) => {
  console.error(error.name, error.message);
  console.error("unhandled  exception occurred. Exiting process...");
  process.exit(1);
});

process.on("uncaughtException", (error: any) => {
  console.error(error.name, error.message);
  console.error("Uncaught exception occurred. Exiting process...");
  process.exit(1);
});

export default app;
