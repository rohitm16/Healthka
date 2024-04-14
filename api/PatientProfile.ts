import express, { NextFunction, Request, Response } from "express";
import { PatientProfile } from "../services/PatientProfileServices";

import jwt from "jsonwebtoken";
import { CustomError } from "../middleware/customError";
import { asyncErrorHandler } from "../middleware/asyncErrorHandler";

const patientProfile = express.Router();

const services = new PatientProfile();

patientProfile.put(
  "/update_patient_data",

  asyncErrorHandler(async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const updateData = await services.UpdatePatientData(data); // Wait for the promise to resolve
      res.status(200).json(updateData);
    } catch (error: any) {
      res.status(500).json({ message: "Server failure", error: error.message });
    }
  })
);
patientProfile.get(
  "/get_all_patient",

  asyncErrorHandler(async (req: Request, res: Response) => {
    const data = req.cookies.JWT;
    const decodedToken: any = jwt.decode(data);
    const doctorId = decodedToken?.doctor_id;
    const clinic_id = decodedToken?.clinic_id;

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 3;
    const getData = await services.GetAllPatient(
      doctorId,
      clinic_id,
      page,
      pageSize
    );
    if (getData !== undefined) {
      return res.status(200).json(getData);
    }
  })
);

patientProfile.get(
  "/get_patient_by_doctor_id",

  asyncErrorHandler(async (req: Request, res: Response) => {
    const data = req.cookies.JWT;
    const decodeData: any = jwt.decode(data);
    const doctorId = decodeData?.doctor_id;
    const patientId: any = req.query.patient_id;

    const getData = await services.GetPatientByDoctorID(doctorId, patientId);
    if (getData !== undefined) {
      return res.status(200).json(getData);
    }
  })
);

export default patientProfile;
