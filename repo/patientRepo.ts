import { error, log } from "console";
import {
  ApiResponse,
  Doctors_patient,
  Patient_profile,
} from "../class/patientsClass";
import mysqlPool, { transactionConnection } from "../config/mysqlConfig";
import RecordsModel from "../mongoModel/recordsList";

import util from "util";
import { UUID } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { CustomError } from "../middleware/customError";
import doctorsPatient from "../mongoModel/doctorsPatient";

class ManagePatients {
  async CreatePatient(data: Patient_profile & Doctors_patient, callBack: any) {
    try {
      transactionConnection.beginTransaction(async (err: any) => {
        if (err) {
          throw err;
        }

        try {
          await this.insertPatient(data, async (patientResponse: any) => {
            if (patientResponse.apiSuccess === 1) {
              if (patientResponse.repeat === 1) {
                data.patient_id = patientResponse.result[0].patient_id;
              }
              await this.insertDoctorPatient(
                data,
                async (doctorResponse: any) => {
                  if (doctorResponse.apiSuccess === 1) {
                    transactionConnection.commit((commitError: any) => {
                      if (commitError) {
                        transactionConnection.rollback();
                        return callBack({
                          apiSuccess: 0,
                          resSuccess: 0,
                          message: "Failed to commit transaction",
                          error: commitError,
                        });
                      } else {
                        return callBack({
                          apiSuccess: 1,
                          resSuccess: 1,
                          message: "Data inserted successfully",
                          result: patientResponse.result,
                        });
                      }
                    });
                  } else {
                    transactionConnection.rollback();
                    return callBack({
                      apiSuccess: 0,
                      resSuccess: 0,
                      message: doctorResponse.error.sqlMessage,
                      error: doctorResponse.error,
                    });
                  }
                }
              );
            } else {
              transactionConnection.rollback();
              return callBack({
                apiSuccess: 0,
                resSuccess: 0,
                message: patientResponse.error.sqlMessage,
                error: patientResponse.error,
              });
            }
          });
        } catch (error) {
          transactionConnection.rollback(); // Rollback changes if any query fails
          callBack({
            apiSuccess: 0,
            resSuccess: 0,
            message: "Failed to insert data",
            error: error,
          });
        }
      });
    } catch (error: any) {
      callBack({
        apiSuccess: 0,
        resSuccess: 0,
        message: "Error in transaction",
        error: error.message,
      });
    }
  }

  private async insertPatient(
    data: Patient_profile & Doctors_patient,
    callBack: any
  ): Promise<void> {
    //Test in future

    const transactionAsync = util
      .promisify(transactionConnection.query)
      .bind(transactionConnection);
    const checkTheQuery = `SELECT patient_name,patient_id, phone_number FROM patients WHERE patient_name=? AND phone_number=?
    `;

    const CheckValue = [data.patient_name, data.phone_number];

    const result = await transactionAsync({
      sql: checkTheQuery,
      values: CheckValue,
    });

    if (Array.isArray(result) && result.length > 0) {
      return callBack({
        apiSuccess: 1,
        resSuccess: 1,
        repeat: 1,
        message: "Patient with the same name and phone number already exists",
        result: result,
        error: null,
      });
    } else {
      const query = `INSERT INTO patients (patient_id, patient_name, age, phone_number, gender)
      VALUES (?, ?, ?, ?, ?)`;

      const values = [
        data.patient_id,
        data.patient_name,
        data.age,
        data.phone_number,
        data.gender,
      ];
      try {
        await transactionConnection.query(query, values, (error, result) => {
          if (error) {
            return callBack({
              apiSuccess: 0,
              resSuccess: 0,
              message: error.sqlMessage,
              error: error,
            });
          }
          if (result) {
            return callBack({
              apiSuccess: 1,
              resSuccess: 1,
              message: "Data inserted Successfully",
              error: error,
            });
          }
        });
      } catch (error) {
        throw error; // Propagate the error to the caller
      }
    }
  }

  private async insertDoctorPatient(
    data: Patient_profile & Doctors_patient,
    callBack: any
  ): Promise<void> {
    try {
      const outPut = await doctorsPatient.find({
        doctor_id: data.doctor_id,
        patient_name: data.patient_name,
        phone_number: data.phone_number,
        clinic_id: data.clinic_id,
      });

      if (outPut.length > 0) {
        return callBack({
          apiSuccess: 1,
          resSuccess: 1,
          message: "Doctor patient data is already there",
        });
      } else {
        const result = await doctorsPatient.create(data);
        if (result) {
          return callBack({
            apiSuccess: 1,
            resSuccess: 1,
            message: "Patient added successfully",
          });
        }
      }
      if (!outPut) {
        return callBack({
          apiSuccess: 0,
          resSuccess: 0,
          message: "Error occur",
          error: outPut,
        });
      }
    } catch (error) {
      alert("Server error please try again");
      throw new Error("Something went wrong please try after sometimes"); // Propagate the error to the caller
    }
  }

  // Need to add gender in data base
  async UpdatePatient(data: Doctors_patient, callBack: any) {
    try {
      const query = `
            UPDATE doctors_patients
            SET
                patient_name = ?,
                phone_number = ?,
                age = ?
            WHERE
                doctor_id = ? AND patient_id = ?
        `;

      const values = [
        data.patient_name,
        data.phone_number,
        data.age,
        data.doctor_id,
        data.patient_id,
      ];

      mysqlPool.query(query, values, (error, result) => {
        if (error) {
          return callBack({
            apiSuccess: 0,
            resSuccess: 0,
            message: error.sqlMessage,
            error: error,
          });
        } else if (result.affectedRows > 0) {
          const error = new CustomError("unable to update data", 404);
          return callBack({
            apiSuccess: 1,
            resSuccess: 1,
            message: error.message,
            statusCode: error.statusCode,
            data: result,
          });
        } else {
          callBack({
            apiSuccess: 0,
            resSuccess: 0,
            message: "No rows updated",
          });
        }
      });
    } catch (error: any) {
      return callBack({
        error: error.message,
      });
    }
  }

  //Changed to mongoDb for trial **

  // async GetPatientByDoctorID(
  //   doctorId: String,
  //   patientId: String,
  //   callBack: any
  // ) {
  //   const query = `SELECT * FROM doctors_patients WHERE doctor_id = ? AND patient_id = ?`;
  //   const values = [doctorId, patientId];

  //   mysqlPool.query(query, values, (error, result) => {
  //     if (error) {
  //       callBack({
  //         apiSuccess: 0,
  //         resSuccess: 0,
  //         message: "Database query error",
  //         error: error,
  //       });
  //     } else {
  //       if (result.length < 1) {
  //         callBack({
  //           apiSuccess: 1,
  //           resSuccess: 0,
  //           message: "No data found with this doctor ID",
  //         });
  //       } else {
  //         callBack({
  //           apiSuccess: 1,
  //           resSuccess: 1,
  //           data: result,
  //         });
  //       }
  //     }
  //   });

  //trying a mongodb Version
  async GetPatientByDoctorID(
    doctorId: String,
    patientId: String,
    callBack: any
  ) {
    try {
      const response = await doctorsPatient.find({
        doctor_id: doctorId,
        patient_id: patientId,
      });

      if (response.length === 0 || !response) {
        return callBack({
          apiSuccess: 1,
          resSuccess: 0,
          message: "No patient data found",
          data: response,
        });
      }

      const data = await RecordsModel.find(
        {
          doctor_id: doctorId,
          patient_id: patientId,
        },
        {
          // Specify the fields you want to include in the result

          case_history: 1,
          prescription_id: 1,
          createdAt: 1,
          FollowUpDate: 1,
          created_at: 1,
        }
      );

      if (!data) {
        return callBack({
          apiSuccess: 1,
          resSuccess: 0,
          error: data,
          message: "No data found",
        });
      }
      if (data.length === 0) {
        const error = new CustomError("Patient data not found ", 404);
        return callBack({
          apiSuccess: 1,
          resSuccess: 0,
          patientData: response,
          message: error.message,
          statusCode: error.statusCode,
        });
      } else {
        console.log("I am working fine");

        return callBack({
          apiSuccess: 1,
          resSuccess: 1,
          message: "Got data",
          patientData: response,
          data: data,
          dataLength: data.length,
        });
      }
    } catch (error) {
      return callBack({
        apiSuccess: 1,
        resSuccess: 0,
        message: "No data found",
        error: error,
      });
    }
  }

  async GetAllPatient(
    doctor_id: string,
    clinic_id: string,
    page: number,
    pageSize: number
  ): Promise<ApiResponse> {
    try {
      const offset = (page - 1) * pageSize;
      const result = await doctorsPatient
        .find({ doctor_id: doctor_id, clinic_id: clinic_id })
        .skip(offset)
        .limit(pageSize)
        .exec();

      const length = await doctorsPatient
        .find({ doctor_id: doctor_id, clinic_id: clinic_id })
        .countDocuments();

      if (result.length === 0) {
        const error = new CustomError("No data found", 404);
        return {
          apiSuccess: 1,
          resSuccess: 0,
          message: error.message,
        };
      } else {
        return {
          apiSuccess: 1,
          resSuccess: 1,
          message: "Data found",
          nhHits: length,
          data: result,
        };
      }
    } catch (error: any) {
      return {
        apiSuccess: 0,
        resSuccess: 0,
        message: `Database query error ${error.message}`,
        error: error.message,
      };
    }
  }
}

export default ManagePatients;
