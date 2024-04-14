import express, { Request, Response } from "express";
import doctor_profile_service from "../services/doctorProfileService";
import jwt from "jsonwebtoken";

import { asyncErrorHandler } from "../middleware/asyncErrorHandler";
import Doctor_profile_repo from "../repo/doctorRepo";

const DocRouter = express.Router();
const service = new doctor_profile_service();
const repo = new Doctor_profile_repo();
DocRouter.post(
  "/create-doctor-profile",
  asyncErrorHandler(async (req: Request, res: Response) => {
    try {
      // need to create new doctor id with name state name and etc .
      const data = req.body;
      const data2 = req.body;

      console.log(data, data2);

      const newDoctor = await service.CreateDoctorProfile(data, data2);
      //try to add both address so that we can check the outcome in future **
      if (newDoctor !== undefined) {
        // Check if newDoctor contains a valid doctorId
        return res.status(200).json(newDoctor);
      } else {
        return res
          .status(400)
          .json({ error: "Failed to create doctor profile" });
      }
    } catch (error) {
      console.error("Error creating doctor profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
);

//No need of separate address api as both will be done

// DocRouter.post("/add_doctor_address", async (req: Request, res: Response) => {
//   //new to auto gen address id;
//   const data = req.body;
//   try {
//     const addingAddress = await service.AddDoctorAddress(data);
//     if (addingAddress !== undefined) {
//       return res.status(200).json(addingAddress);
//     }
//   } catch (error) {
//     return res.status(400).json({
//       error: "Failed to add address",
//     });
//   }
// });

DocRouter.post(
  "/add_clinic",
  asyncErrorHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const data2 = req.body;
    const data3 = req.body;

    const addingClinic = await service.CreateClinicProfile(data, data2, data3);
    if (addingClinic !== undefined) {
      return res.status(200).json(addingClinic);
    }
  })
);

//testing only
DocRouter.get(
  "/get_clinic_doctors",
  asyncErrorHandler(async (req: Request, res: Response) => {
    const data = req.cookies.JWT;
    const decodeToken: any = jwt.decode(data);
    const doctor_id = decodeToken?.doctor_id;

    const getClinic = await service.GetClinicDoctor(doctor_id);
    if (getClinic !== undefined) {
      return res.status(200).json(getClinic);
    }
  })
);

// DocRouter.post("/add_clinic_address", async (req: Request, res: Response) => {
//   const data = req.body;
//   try {
//     const addingAddress = await service.CreateClinicAddress(data);
//     if (addingAddress !== undefined) {
//       return res.status(200).json(addingAddress);
//     }
//   } catch (error) {
//     return res.status(400).json({
//       message: "Failed to add address",
//       error: error,
//     });
//   }
// });
DocRouter.post(
  "/authentication",
  asyncErrorHandler(async (req: Request, res: Response) => {
    const data = req.body;

    const auth = await service.CreateAuth(data);
    if (auth !== undefined) {
      res.status(200).json(auth);
    } else {
      res.status(400).json({ message: "Failed to insert data" });
    }
  })
);
DocRouter.post(
  "/login",
  asyncErrorHandler(async (req: Request, res: Response) => {
    const data = req.body;

    repo.Login(data, res, (loginResponse: any) => {
      if (loginResponse !== undefined) {
        return res.status(200).json(loginResponse);
      } else {
        return res.status(400).json({ message: "Failed to Authenticate" });
      }
    });
  })
);

//only with out a repo and service
//need to add try catch
DocRouter.post("/logout", async (req: Request, res: Response) => {
  try {
    if (process.env.NODE_ENV === "development") {
      res.clearCookie("JWT");
      res.clearCookie("doctor_name");
      res.clearCookie("clinic_name");
    } else {
      res.clearCookie("JWT", { domain: ".healthka.life", path: "/" });
      res.clearCookie("doctor_name", { domain: ".healthka.life", path: "/" });
      res.clearCookie("clinic_name", { domain: ".healthka.life", path: "/" });
    }
    // await req.user.save();
    console.log("all done");

    res.send("Logged out successfully.");
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
});
DocRouter.get("/health", (req: Request, res: Response) => {
  res.status(200).send("OK");
});

export default DocRouter;
