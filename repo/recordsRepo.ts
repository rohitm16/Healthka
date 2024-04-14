import { Records, BillRecords } from "../class/recordsClass";
import { CustomError } from "../middleware/customError";
import Bill from "../mongoModel/Bill";
import doctorsPatient from "../mongoModel/doctorsPatient";
// import ForFollowup from "../mongoModel/followUp";
import RecordsModel from "../mongoModel/recordsList";
import { response } from "express";
import Response from "express";

export class ManageRecords {
  async CreatePrescription(data: Records, callBack: any) {
    try {
      if (
        data.patient_name === undefined ||
        data.patient_name === "" ||
        data.patient_name === null ||
        data.age === undefined ||
        data.age === 0 ||
        data.age === null ||
        data.gender === undefined ||
        data.gender === "" ||
        data.gender === null
      ) {
        return callBack({
          apiSuccess: 0,
          resSuccess: 0,
          message: "Patient information's  cannot be null",
        });
      }

      const response = await RecordsModel.create(data).catch((error) => {
        return callBack({
          apiSuccess: 0,
          resSuccess: 0,
          message: error.message,
        });
      });

      console.log("This is the reponse", response);

      if (!response) {
        return callBack({
          apiSuccess: 0,
          resSuccess: 0,
          message: "Server Error, please check the data",
        });
      }

      // console.log("====================================");
      // console.log(data.follow_up);
      // console.log("====================================");

      // if (data.follow_up) {
      //   const follow = await ForFollowup.create({
      //     ...data,
      //     prescription_id: response._id,
      //   });
      //   if (!follow) {
      //     return callBack({
      //       apiSuccess: 0,
      //       resSuccess: 0,
      //       message: "Server Error, please check the data",
      //     });
      //   }
      //   return callBack({
      //     apiSuccess: 1,
      //     resSuccess: 1,
      //     message: "Followup Created Successfully",
      //     data: follow,
      //   });
      // }

      return callBack({
        apiSuccess: 1,
        resSuccess: 1,
        message: "Prescription Created Successfully",
        data: response,
      });
    } catch (error: any) {
      throw new Error(`Server Error ${error.message}`);
    }
  }

  async GetPrescriptionDataByDoctorId(
    data: String,
    page: number,
    pageSize: number,
    callBack: any
  ) {
    try {
      const offset = (page - 1) * pageSize;
      const response = await RecordsModel.find(
        { doctor_id: data },
        {
          prescription_id: 1,
          patient_name: 1,
          createdAt: 1,
          phone_number: 1,
          patient_id: 1,
        }
      )
        .skip(offset)
        .limit(pageSize);

      const length = await RecordsModel.find({
        doctor_id: data,
      }).countDocuments();

      if (response && response.length > 0) {
        return callBack({
          apiSuccess: 1,
          resSuccess: 1,
          message: "Prescription data found successfully",
          data: response,
          nhHists: length,
        });
      } else {
        const error = new CustomError("No prescription data found", 404);
        return callBack({
          apiSuccess: 1,
          resSuccess: 0,
          message: error.message,
          statusCode: error.statusCode,
          data: [],
        });
      }
    } catch (error: any) {
      console.error("Error fetching prescription data:", error);
      return callBack({
        apiSuccess: 0,
        resSuccess: 0,
        message: "An error occurred while fetching prescription data",
        error: error.message,
      });
    }
  }

  async GetPrescriptionById(data: String, callBack: any) {
    try {
      const response = await RecordsModel.findOne({
        prescription_id: data,
      });
      if (response) {
        return callBack({
          apiSuccess: 1,
          resSuccess: 1,
          message: "Prescription data found successfully",
          data: response,
        });
      } else {
        const error = new CustomError("No prescription data found", 404);
        return callBack({
          apiSuccess: 1,
          resSuccess: 0,
          message: error.message,
          statusCode: error.statusCode,
          data: [],
        });
      }
    } catch (error: any) {
      console.error("Error fetching prescription data:", error);
      return callBack({
        apiSuccess: 0,
        resSuccess: 0,
        message: "An error occurred while fetching prescription data",
        error: error.message,
      });
    }
  }

  // BILLING Function starts from here

  async CreateBill(data: BillRecords, callBack: any) {
    try {
      const response = await Bill.create(data);

      if (!response) {
        return callBack({
          apiSuccess: 0,
          resSuccess: 0,
          message: "An Error occur while saving the Bill please try again",
          data: response,
        });
      } else {
        return callBack({
          apiSuccess: 1,
          resSuccess: 1,
          message: "Data saved successfully",
          data: response,
        });
      }
    } catch (error: any) {
      return callBack({
        apiSuccess: 0,
        resSuccess: 0,
        message: "An Error occur while saving the Bill please try again",
        error: error.message,
      });
    }
  }

  // Get Bill

  async GetAllBill(data: BillRecords, callBack: any) {
    try {
      const response = await Bill.find(
        {
          doctor_id: data.doctor_id,
          clinic_id: data.clinic_id,
          patient_id: data.patient_id,
        },
        {
          prescription_id: 1,
        }
      );

      if (response.length > 0 && response) {
        callBack({
          apiSuccess: 1,
          resSuccess: 1,
          message: "Data found",
          data: response,
        });
      } else {
        callBack({
          apiSuccess: 0,
          resSuccess: 0,
          message: "No data found",
          data: response,
        });
      }
    } catch (error: any) {
      callBack({
        apiSuccess: 0,
        resSuccess: 0,
        message: error.message,
      });
    }
  }

  async GetBill(data: BillRecords, callBack: any) {
    try {
      const response = await Bill.find({
        doctor_id: data.doctor_id,
        prescription_id: data.prescription_id,
        clinic_id: data.clinic_id,
      });

      const doctorPatient = await doctorsPatient.find(
        {
          doctor_id: data.doctor_id,
          clinic_id: data.clinic_id,
          patient_id: response[0].patient_id,
        },
        { _id: 0, patient_name: 1, phone_number: 1, age: 1, gender: 1 }
      );

      if (!doctorPatient) {
        return callBack({
          apiSuccess: 1,
          resSuccess: 0,
          message: "No patient data found",
          data: doctorPatient,
        });
      }

      if (response.length === 0) {
        return callBack({
          apiSuccess: 1,
          resSuccess: 0,
          message: "No data found",
          data: response,
        });
      } else {
        return callBack({
          apiSuccess: 1,
          resSuccess: 1,
          data: response,
          data2: doctorPatient,
        });
      }
    } catch (error: any) {
      return callBack({
        apiSuccess: 0,
        resSuccess: 0,
        message: "Unable to get data try again later",
        error: error.message,
      });
    }
  }
}
