import express, { NextFunction, Request, Response } from "express";
// Assuming DoctorPatient is your Mongoose model for doctor patients
import jwt from "jsonwebtoken";
import doctorsPatient from "../mongoModel/doctorsPatient";
import util from "util";
import fs from "fs";
import mysqlPool from "../config/mysqlConfig";

const predictionApi = express.Router();

predictionApi.post("/prediction", async (req: Request, res: Response) => {
  try {
    const { phone_number } = req.body;
    const data = req.cookies.JWT;
    const decodedToken: any = jwt.decode(data);
    const doctorId = decodedToken?.doctor_id;
    const clinicId = decodedToken?.clinic_id;

    console.log(doctorId);

    // Construct the MongoDB query
    const query = {
      $and: [
        {
          $or: [
            { phone_number: { $regex: "^" + phone_number, $options: "i" } },
          ],
        },
        { doctor_id: doctorId, clinic_id: clinicId },
      ],
    };

    // Execute the query
    const result = await doctorsPatient.find(query, {
      doctor_id: 1,
      patient_name: 1,
      age: 1,
      phone_number: 1,
      gender: 1,
    });

    console.log(result);

    if (!result) {
      return res.status(400).json({
        apiSuccess: 0,
        resSuccess: 0,
        message: "Database connection fail",
        error: result,
      });
    }

    if (result.length === 0) {
      return res.status(201).json({
        apiSuccess: 1,
        resSuccess: 0,
        message: "No data found",
      });
    }

    return res.status(200).json({
      apiSuccess: 1,
      resSuccess: 1,
      result: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      apiSuccess: 0,
      resSuccess: 0,
      message: "Server Failure",
      error: error.message,
    });
  }
});

predictionApi.post(
  "/service_name_prediction",
  async (req: Request, res: Response) => {
    try {
      const queryAsync = util.promisify(mysqlPool.query).bind(mysqlPool);
      const data = req.cookies.JWT;
      const decodedToken: any = jwt.decode(data);
      const doctorId = decodedToken?.doctor_id;
      const clinicId = decodedToken?.clinic_id;
      const { service_name } = req.body;

      const query = `SELECT service_name, service_charges FROM services WHERE doctor_id=${doctorId} AND clinic_id=${clinicId} AND service_name LIKE '${service_name}%'`;
      console.log(query);
      const response = await queryAsync(query);
      console.log(response);

      if (!response) {
        return res.status(404).json({
          apiSuccess: 0,
          resSuccess: 0,
          data: response,
        });
      } else {
        return res.status(200).json({
          apiSuccess: 1,
          resSuccess: 1,
          data: response,
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        apiSuccess: 1,
        resSuccess: 1,
        message: "Server Error",
        error: error.message,
      });
    }
  }
);

predictionApi.post("/Symptoms", (req: Request, res: Response) => {
  try {
    const complaint = req.body.complaint;

    const jsonData = fs.readFileSync("./Data.json", "utf-8");

    const data = JSON.parse(jsonData);

    const predictions = data.filter((item: any) => {
      return item.Symptom.toLowerCase().startsWith(complaint.toLowerCase());
    });

    if (complaint === "") {
      return res
        .status(202)
        .json({ apiSuccess: 0, resSuccess: 0, message: "No data found" });
    }

    if (predictions.length === 0) {
      return res
        .status(202)
        .json({ apiSuccess: 0, resSuccess: 0, message: "No data found" });
    }

    return res
      .status(200)
      .json({ apiSuccess: 1, resSuccess: 1, data: predictions });
  } catch (error: any) {
    return res
      .status(500)
      .json({ apiSuccess: 0, resSuccess: 0, message: error.message });
  }
});

predictionApi.post("/Diagnosis", (req: Request, res: Response) => {
  try {
    const disease = req.body.disease;

    const jsonData = fs.readFileSync("./Diagnosis.json", "utf-8");

    const data = JSON.parse(jsonData);

    const predictions = data.filter((item: any) => {
      return item.disease.toLowerCase().startsWith(disease.toLowerCase());
    });

    if (disease === "") {
      return res
        .status(202)
        .json({ apiSuccess: 0, resSuccess: 0, message: "No data found" });
    }

    if (predictions.length === 0) {
      return res
        .status(202)
        .json({ apiSuccess: 0, resSuccess: 0, message: "No data found" });
    }

    return res
      .status(200)
      .json({ apiSuccess: 1, resSuccess: 1, data: predictions });
  } catch (error: any) {
    return res
      .status(500)
      .json({ apiSuccess: 0, resSuccess: 0, message: error.message });
  }
});

predictionApi.post("/Test", (req: Request, res: Response) => {
  try {
    const test = req.body.test;

    const jsonData = fs.readFileSync("./Test.json", "utf-8");

    const data = JSON.parse(jsonData);

    const predictions = data.filter((item: any) => {
      return item.Test.toLowerCase().startsWith(test.toLowerCase());
    });

    if (test === "") {
      return res
        .status(202)
        .json({ apiSuccess: 0, resSuccess: 0, message: "No data found" });
    }

    if (test.length === 0) {
      return res
        .status(202)
        .json({ apiSuccess: 0, resSuccess: 0, message: "No data found" });
    }

    return res
      .status(200)
      .json({ apiSuccess: 1, resSuccess: 1, data: predictions });
  } catch (error: any) {
    return res
      .status(500)
      .json({ apiSuccess: 0, resSuccess: 0, message: error.message });
  }
});

predictionApi.post("/Medicine", (req: Request, res: Response) => {
  try {
    const Medicine = req.body.Medicine;

    const jsonData = fs.readFileSync("./Medicine.json", "utf-8");

    const data = JSON.parse(jsonData);

    const predictions = data.filter((item: any) => {
      return item.Medicine.toLowerCase().startsWith(Medicine.toLowerCase());
    });

    if (Medicine === "") {
      return res
        .status(202)
        .json({ apiSuccess: 0, resSuccess: 0, message: "No data found" });
    }

    if (Medicine.length === 0) {
      return res
        .status(202)
        .json({ apiSuccess: 0, resSuccess: 0, message: "No data found" });
    }

    return res
      .status(200)
      .json({ apiSuccess: 1, resSuccess: 1, data: predictions });
  } catch (error: any) {
    return res
      .status(500)
      .json({ apiSuccess: 0, resSuccess: 0, message: error.message });
  }
});

export default predictionApi;
