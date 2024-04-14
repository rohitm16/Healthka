import express, { NextFunction, Request, Response } from "express";

import { ServiceServices } from "../services/serviceServices";

import jwt from "jsonwebtoken";
import { asyncErrorHandler } from "../middleware/asyncErrorHandler";

const serviceRouter = express.Router();

const services = new ServiceServices();

serviceRouter.post(
  "/create_new_service",

  asyncErrorHandler(async (req: Request, res: Response) => {
    let data = req.body;

    const cookieData = req.cookies.JWT;
    const decodeData: any = jwt.decode(cookieData);
    const doctor_id = decodeData?.doctor_id;
    const clinic_id = decodeData?.clinic_id;
    // Append doctor_id and clinic_id to each service data

    console.log(doctor_id);
    console.log(clinic_id);

    console.log(data);

    const newService = await services.CreateService(data, doctor_id, clinic_id);
    if (newService !== undefined) {
      return res.status(200).json(newService);
    }
  })
);

serviceRouter.put(
  "/update_services",

  asyncErrorHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const updateService = await services.UpdateService(data);
    if (updateService !== undefined) {
      return res.status(200).json(updateService);
    }
    return res.status(400).json({ error: "Failed to update service" });
  })
);
serviceRouter.get(
  "/get_services",

  asyncErrorHandler(async (req: Request, res: Response) => {
    //need to work on this api
    const data = req.cookies.JWT;
    const finalData: any = jwt.decode(data);
    const doctor_id = finalData?.doctor_id;
    const clinic_id = finalData?.clinic_id;

    const getData = await services.GetServices(doctor_id, clinic_id);

    if (getData !== undefined) {
      return res.status(200).json(getData);
    }
    return res.status(400).json({ error: "Failed to get data" });
  })
);
serviceRouter.post(
  "/delete_service", // Define route without service_id in URL parameter

  asyncErrorHandler(async (req: Request, res: Response) => {
    console.log(req.body); // Log the request body to check if service_id is present

    const service_id = req.body.service_id;
    console.log("====================================");
    console.log(service_id);
    console.log("====================================");
    const deleteServices = await services.DeleteService(service_id);

    if (deleteServices !== undefined) {
      return res.status(200).json(deleteServices);
    }
    return res.status(400).json({ error: "Failed to get data" });
  })
);

export default serviceRouter;
