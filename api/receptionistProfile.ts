import express, { Request, Response } from "express";
import { asyncErrorHandler } from "../middleware/asyncErrorHandler";
import { ReceptionistRepo } from "../repo/receptionistRepo";
import  receptionist_profile_services  from "../services/receptionistService";

const service = new receptionist_profile_services();
const repo = new ReceptionistRepo();

const RecepRouter = express.Router();

RecepRouter.post(
  "/create-receptionist-profile",
  asyncErrorHandler(async (request:Request, response:Response) => {
    try {
      const data = request.body;
      console.log(data)
      const newReceptionist = await service.CreateReceptionistProfile(data);
      if (newReceptionist !== undefined) {
        return response.status(200).json("Success");
      } else {
        return response.status(500).json({ error: "Failed to register " });
      }
    } catch (error) {
      console.error("Error creating receptionist profile:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  })
);

// RecepRouter.get("/recpetionist",asyncErrorHandler(async(Request,response)=>{
//     try {
//         // returs login page of receptionist by fectching credentials from cookie
//     } catch (error) {

//     }
// }))

export default RecepRouter
