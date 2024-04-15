import express, { Request, Response } from "express";
import { asyncErrorHandler } from "../middleware/asyncErrorHandler";
import { ReceptionistRepo } from "../repo/receptionistRepo";
import { Receptionist_profile } from "../class/receptionistClass";

const repo = new ReceptionistRepo();

const RecepRouter = express.Router();

RecepRouter.post(
    "/create-receptionist-profile",
    asyncErrorHandler(async (request: Request, response: Response) => {
        try {
            const data: Receptionist_profile = request.body;

            const result = await new Promise((resolve, reject) => {
                const callback = (result: any) => {
                    if (result.apiSuccess === 1) {
                        resolve("Success");
                    } else {
                        reject({ error: "Failed to register" });
                    }
                };

                repo.createReceptionistProfile(data, callback);
            });

            response.status(200).json(result);
        } catch (error) {
            console.error("Error creating receptionist profile:", error);
            response.status(500).json({ error: "Internal server error" });
        }
    })
);

export default RecepRouter;
