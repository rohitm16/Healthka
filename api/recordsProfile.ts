import express, { Request, Response } from "express";
import { RecordServices } from "../services/recordsServices";

import jwt from "jsonwebtoken";
import { log } from "console";
import { asyncErrorHandler } from "../middleware/asyncErrorHandler";
import { CustomError } from "../middleware/customError";
import { ManageRecords } from "../repo/recordsRepo";
import { response } from "express";

const recordsRouter = express.Router();
const services = new RecordServices();
const repo = new ManageRecords();

recordsRouter.post(
  "/create_prescription",

  asyncErrorHandler(async (req: Request, res: Response) => {
    const cookie = req.cookies.JWT;
    const decodeDoc: any = jwt.decode(cookie);
    const doctor_id = decodeDoc?.doctor_id;
    const clinic_id = decodeDoc?.clinic_id;

    const data = {
      ...req.body,
      doctor_id: doctor_id,
      clinic_id: clinic_id,
    };
    const data2 = {
      ...req.body,
      doctor_id: doctor_id,
      clinic_id: clinic_id,
    };

    const postData = await services.CreatePrescription(data, data2);
    if (postData !== undefined) {
      return res.status(200).json(postData);
    }
  })
);

recordsRouter.get(
  "/get_prescription",

  asyncErrorHandler(async (req: Request, res: Response) => {
    const data = req.cookies.JWT;
    const decodedToken: any = jwt.decode(data);
    const doctorId = decodedToken?.doctor_id;

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 6;
    const getData = await services.GetPrescriptionDataByDoctorId(
      doctorId,
      page,
      pageSize
    );
    if (getData !== undefined) {
      return res.status(200).json(getData);
    }
  })
);

recordsRouter.post(
  "/get_single_prescription",

  asyncErrorHandler(async (req: Request, res: Response) => {
    const data = req.body.prescription_id;
    const getIndividualData = await services.GetPrescriptionById(data);
    if (getIndividualData !== undefined) {
      return res.status(200).json(getIndividualData);
    }
    return res.status(400).json("Unable to get data");
  })
);

recordsRouter.post(
  "/create_bill",
  asyncErrorHandler(async (req: Request, res: Response) => {
    const doctor_data = req.cookies.JWT;
    const decodeToken: any = jwt.decode(doctor_data);
    const doctor_id = decodeToken?.doctor_id;
    const clinic_id = decodeToken?.clinic_id;
    const data = { ...req.body, doctor_id, clinic_id };

    repo.CreateBill(data, (resp: any) => {
      if (resp.apiSuccess === 1) {
        res.status(200).json(resp);
      } else {
        res.status(400).json(resp);
      }
    });
  })
);

recordsRouter.post(
  "/get_bill",
  asyncErrorHandler(async (req: Request, res: Response) => {
    const doctor_data = req.cookies.JWT;
    const decodeToken: any = jwt.decode(doctor_data);
    const doctor_id = decodeToken?.doctor_id;
    const clinic_id = decodeToken?.clinic_id;
    const data = { ...req.body, doctor_id, clinic_id };

    repo.GetBill(data, (response: any) => {
      if (response.apiSuccess === 1) {
        res.status(200).json(response);
      } else {
        res.status(500).json(response);
      }
    });
  })
);

recordsRouter.post(
  "/get_all_bill",
  asyncErrorHandler(async (req: Request, res: Response) => {
    const doctor_data = req.cookies.JWT;
    const decodeToken: any = jwt.decode(doctor_data);
    const doctor_id = decodeToken?.doctor_id;
    const clinic_id = decodeToken?.clinic_id;
    const data = { ...req.body, doctor_id, clinic_id };
    console.log("Bill is working fine");

    repo.GetAllBill(data, (response: any) => {
      if (response.apiSuccess === 1) {
        return res.status(200).json(response);
      }
      if (response.apiSuccess === 0) {
        return res.status(202).json(response.message);
      } else {
        return res.status(502).json(response);
      }
    });
  })
);

export default recordsRouter;
