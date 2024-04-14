import mysql_pool from "../config/mysqlConfig";
import basicDoctorData from "../mongoModel/basicDoctorData";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import {
  Address,
  Doctor_profile,
  Clinic_profile,
  Clinic_address,
  Clinic_doctors,
  BasicDoctorData,
} from "../class/doctorClass";
import util from "util";
import { transactionConnection } from "../config/mysqlConfig";
import { Auth } from "../class/authClass";
import { Response, response } from "express";
import { log } from "console";
import { Doctors_patient } from "../class/patientsClass";

const queryAsync = util
  .promisify(transactionConnection.query)
  .bind(transactionConnection);

// Promisify the query function
const transActionAsync = util
  .promisify(transactionConnection.beginTransaction)
  .bind(transactionConnection);
const transactionRollBack = util
  .promisify(transactionConnection.rollback)
  .bind(transactionConnection);

class Doctor_profile_repo {
  async CreatingDoctorProfile(
    doctorProfile: Doctor_profile,
    address: Address,
    callBack: any
  ) {
    try {
      await transActionAsync();
      const doctorProfileData = await this.DoctorProfile(doctorProfile);
      if (doctorProfileData && doctorProfileData.apiSuccess !== 1) {
        await transactionRollBack();
        return callBack({
          apiSuccess: 0,
          resSuccess: 0,
          message: "Transaction failed",
        });
      }
      const doctorAddress = await this.DoctorProfileAddress(address);
      if (doctorAddress?.apiSuccess !== 1) {
        await transactionRollBack();
        return callBack({
          apiSuccess: 0,
          resSuccess: 0,
          message: "Transaction failed",
        });
      } else {
        await transactionConnection.commit();
        return callBack({
          apiSuccess: 1,
          resSuccess: 1,
          message: "Data added successfully",
          data: doctorProfileData,
          data2: doctorAddress,
        });
      }
    } catch (error) {
      return callBack({
        message: "Something went wrong please try again",
        error: error,
      });
    }
  }

  private async DoctorProfile(doctorProfile: Doctor_profile) {
    try {
      const query = `
          INSERT INTO doctor_profile (
            doctor_id,
            first_name,
            second_name,
            DOB,
            gender,
            phone_number,
            email,
            qualification,
            specialization,
            personal_clinic,
            experience,
            year_of_passing,
            college_name,
            NMC_doctor_id
           
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ,?,?,?,?,?)
        `;

      const values = [
        doctorProfile.doctor_id,
        doctorProfile.first_name,
        doctorProfile.last_name,
        doctorProfile.DOB,
        doctorProfile.gender,
        doctorProfile.phone_number,
        doctorProfile.email,
        doctorProfile.qualification,
        doctorProfile.specialization,
        doctorProfile.personal_clinic,
        doctorProfile.experience,
        doctorProfile.year_of_passing,
        doctorProfile.college_name,
        doctorProfile.NMC_doctor_id,
      ];

      const response = await queryAsync({ sql: query, values: values });
      if (!response) {
        return {
          apiSuccess: 0,
          resSuccess: 0,
          message: "failed to insert Data",
          error: response,
        };
      }
      if (response) {
        return {
          apiSuccess: 1,
          resSuccess: 1,
          message: "Data successfully inserted",
          results: doctorProfile.doctor_id,
        };
      }
    } catch (error) {
      console.error("Error creating doctor profile", error);
      throw error; // Throw the error to handle it at a higher level if needed
    }
  }

  private async DoctorProfileAddress(address: Address) {
    try {
      const query = `
        INSERT INTO address (
          address_id, house_number, lane, address_one, landmark, 
          city, state, pincode, country, doctor_id
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        address.address_id,
        address.house_number,
        address.lane,
        address.address_one,
        address.landmark,
        address.city,
        address.state,
        address.pin_code,
        address.country,
        address.doctor_id,
      ];

      const response = await queryAsync({ sql: query, values: values });
      if (!response) {
        return {
          apiSuccess: 0,
          resSuccess: 0,
          message: "failed to insert data",
          response: response,
        };
      }
      if (response) {
        return {
          apiSuccess: 1,
          resSuccess: 1,
          message: "Data inserted Successfully",
          result: response,
        };
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  //Clinic transaction

  async ClinicData(
    clinic: Clinic_profile,
    clinic_address: Clinic_address,
    Clinic_doctors: Clinic_doctors,
    callBack: any
  ) {
    try {
      await transActionAsync();
      const clinicProfileResult = await this.ClinicProfileAsync(clinic);
      if (clinicProfileResult.apiSuccess !== 1) {
        await transactionRollBack();
        return callBack({
          apiSuccess: 0,
          resSuccess: 0,
          message: "Failed to insert clinic data",
          error: clinicProfileResult.error,
        });
      }
      console.log("Debuging  clinicProfileResult  ", clinicProfileResult);

      const clinicAddressResult = await this.ClinicAddressAsync(clinic_address);
      if (clinicAddressResult.apiSuccess !== 1) {
        await transactionRollBack();
        return callBack({
          apiSuccess: 0,
          resSuccess: 0,
          message: "Failed to insert clinic address data",
          error: clinicAddressResult.error,
        });
      }

      const clinicDoctorsResult = await this.ClinicDoctorsAsync(Clinic_doctors);
      if (clinicDoctorsResult.apiSuccess !== 1) {
        await transactionRollBack();

        const errorMessage =
          (clinicDoctorsResult.error as any)?.sqlMessage || "Unknown error";
        return callBack({
          apiSuccess: 0,
          resSuccess: 0,
          message: `Failed to insert clinic information  data as ${errorMessage}`,
          error: clinicDoctorsResult.error,
        });
      }

      await transactionConnection.commit();
      return callBack({
        apiSuccess: 1,
        resSuccess: 1,
        message: "Data inserted successfully",
        clinicDoctorsResult: clinicDoctorsResult,
      });
    } catch (error: any) {
      await transactionRollBack();
      return callBack({
        apiSuccess: 0,
        resSuccess: 0,
        message: "Failed to insert clinic data",
        error: error.sqlMessage,
      });
    }
  }

  private async ClinicProfileAsync(clinic: Clinic_profile) {
    const query = `
        INSERT INTO clinic_profile (
          clinic_id,
          clinic_name,
          start_time,
          end_time,
          gst,
          clinic_phone_number,
          working_days,
          clinic_type
         
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ? )
      `;
    const clinicPhoneNumberJSON = JSON.stringify(clinic.clinic_phone_number);
    const workingDays = JSON.stringify(clinic.working_days);

    const values = [
      clinic.clinic_id,
      clinic.clinic_name,
      clinic.start_time,
      clinic.end_time,
      clinic.gst,
      clinicPhoneNumberJSON,
      workingDays,
      clinic.clinic_type,
    ];

    try {
      const result = await queryAsync({ sql: query, values }); // Use promisified query function
      if (!result) {
        return {
          apiSuccess: 1,
          resSuccess: 1,
          message: "Failed to insert Data",
        };
      }
      return {
        apiSuccess: 1,
        resSuccess: 1,
        message: "Data inserted successfully",
        result: clinic.clinic_id,
      };
    } catch (error) {
      return {
        apiSuccess: 0,
        resSuccess: 0,
        message: "Failed to insert clinic data",
        error: error,
      };
    }
  }

  private async ClinicAddressAsync(clinic_address: Clinic_address) {
    const query = `
      INSERT INTO clinic_address (
        address_id,
        house_number,
        lane,
        address_one,
        landmark,
        city,
        state,
        pincode,
        country,
        clinic_id
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      clinic_address.address_id,
      clinic_address.house_number,
      clinic_address.lane,
      clinic_address.address_one,
      clinic_address.landmark,
      clinic_address.city,
      clinic_address.state,
      clinic_address.pin_code,
      clinic_address.country,
      clinic_address.clinic_id,
    ];

    try {
      const result = await queryAsync({ sql: query, values }); // Use promisified query function
      return {
        apiSuccess: 1,
        resSuccess: 1,
        message: "Data inserted successfully",
        result: clinic_address.clinic_id,
      };
    } catch (error) {
      return {
        apiSuccess: 0,
        resSuccess: 0,
        message: "Failed to insert clinic address data",
        error: error,
      };
    }
  }

  private async ClinicDoctorsAsync(data: Clinic_doctors) {
    const query = `
    INSERT INTO clinic_doctors (
      id,
      clinic_id,
      doctor_id,
      start_time,
      end_time,
      working_days,
      clinic_name,
      clinic_type
  ) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  
    `;
    const workingDays = JSON.stringify(data.working_days);
    const values = [
      data.id,
      data.clinic_id,
      data.doctor_id,
      data.start_time,
      data.end_time,
      workingDays,
      data.clinic_name,
      data.clinic_type,
    ];

    try {
      const result = await queryAsync({ sql: query, values }); // Use promisified query function
      return {
        apiSuccess: 1,
        resSuccess: 1,
        message: "Data inserted successfully",
        result: data.clinic_id,
      };
    } catch (error) {
      return {
        apiSuccess: 0,
        resSuccess: 0,
        message: "Failed to insert clinic doctor data",
        error: error,
      };
    }
  }

  //will use this after learning mongodb transaction
  async SaveBasicDoctorData(
    data: BasicDoctorData,
    callBack: any
  ): Promise<void> {
    try {
      // Create a new instance of the BasicDoctorDataModel
      const newBasicDoctorData = new basicDoctorData({
        doctor_id: data.doctor_id,
        doctor_name: data.first_name, // Assuming first_name is the doctor_name
        clinic: data.clinic.map((clinic) => ({
          clinic_id: clinic.clinic_id,
          clinic_name: clinic.clinic_name,
          clinic_status: clinic.clinic_status,
        })),
        last_login: data.last_login,
        last_logout: data.last_logout,
      });

      // Save the new document to the database
      await newBasicDoctorData.save();

      // Call the callback with success message
      return callBack({
        apiSuccess: 1,
        resSuccess: 1,
        message: "Basic doctor data saved successfully",
      });
    } catch (error: any) {
      // Call the callback with error message
      return callBack({
        apiSuccess: 0,
        resSuccess: 0,
        message: "Failed to save basic doctor data",
        error: error.message,
      });
    }
  }

  //Need to work on this while testing
  async SetActiveClinic(doctorId: string, clinicId: string, callBack: any) {
    try {
      // Set all clinics of the doctor to inactive
      await basicDoctorData.updateMany(
        { doctor_id: doctorId },
        { $set: { "clinic.$.clinic_status": false } }
      );

      // Set the selected clinic to active
      await basicDoctorData.updateOne(
        { doctor_id: doctorId, "clinic.clinic_id": clinicId },
        { $set: { "clinic.$.clinic_status": true } }
      );

      callBack({
        apiSuccess: 1,
        resSuccess: 1,
        message: "Active clinic updated successfully",
      });
    } catch (error: any) {
      callBack({
        apiSuccess: 0,
        resSuccess: 0,
        message: "Failed to update active clinic",
        error: error.message,
      });
    }
  }
  async Auth(auth: Auth, callBack: any) {
    try {
      const query = `
      INSERT INTO auth (doctor_id, doctor_name, clinic_id, phone_number, password) 
      VALUES (?, ?, ?, ?, ?)
    `;

      const password = await bcrypt.hash(auth.password.toString(), 10);

      const Values = [
        auth.doctor_id,
        auth.doctor_name,
        auth.clinic_id,
        auth.phone_number,
        password,
      ];

      console.log(auth.doctor_id);

      mysql_pool.query(query, Values, (error, result) => {
        if (error) {
          return callBack({
            apiSuccess: 0,
            resSuccess: 0,
            error: error,
            message: "Unable to Input data",
          });
        }
        if (result) {
          return callBack({
            apiSuccess: 1,
            resSuccess: 1,
            result: result,
            message: "Data inserted Successfully",
          });
        }
      });
    } catch (error: any) {
      console.error(error.message);
      return callBack({
        apiSuccess: 0,
        resSuccess: 0,
        error: error,
        message: "Unable to Input data",
      });
    }
  }

  private createToken(payload: {
    doctor_id: string;
    doctor_name: string;
    clinic_id: string;
  }) {
    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY environment variable is not defined");
    }

    // Convert process.env.SECRET_KEY to type Secret
    const secretKey: Secret = process.env.SECRET_KEY;

    return jwt.sign(payload, secretKey, {
      expiresIn: "1d",
    });
  }

  private setCookie = (
    res: Response,
    name: string,
    value: string,
    options: any
  ) => {
    res.cookie(name, value, options);
  };
  async Login(auth: Auth, res: Response, callBack: any) {
    try {
      const queryAsync = util.promisify(mysql_pool.query).bind(mysql_pool);
      const query = `SELECT * FROM auth WHERE (doctor_id = ? OR phone_number = ?)`;
      const values = [auth.doctor_id, auth.phone_number];

      const result: any = await queryAsync({ sql: query, values });

      console.log("Result:", result);
      if (result.length === 0) {
        console.log("No results found");
        return callBack({
          apiSuccess: 0,
          resSuccess: 0,
          result: result,
          message: "Doctor id is incorrect",
        });
      }

      const user = result[0];
      const passwordMatch = await bcrypt.compare(auth.password, user.password);
      console.log("====================================");
      console.log(passwordMatch);
      console.log("====================================");

      if (!passwordMatch) {
        // Password incorrect, send error
        return callBack({
          apiSuccess: 0,
          resSuccess: 0,
          message: "Password is incorrect",
        });
      }

      const doctor_id = result[0].doctor_id;
      const doctor_name = result[0].doctor_name;
      const clinic_id = result[0].clinic_id;

      const docQuery = `SELECT first_name,second_name,phone_number,email,qualification
      ,specialization from doctor_profile WHERE doctor_id=${doctor_id}`;

      const clinicQuery = `SELECT * from clinic_address WHERE clinic_id=${clinic_id}`;

      const clinicData = `SELECT clinic_name,clinic_phone_number,working_days,start_time,end_time from clinic_profile WHERE clinic_id=${clinic_id}`;
      // need to handle error in future ... please look at it
      const docResult = await queryAsync(docQuery);
      const clinicAddressResult = await queryAsync(clinicQuery);
      const clinicResult: any = await queryAsync(clinicData);

      const token = this.createToken({ doctor_id, doctor_name, clinic_id });
      const isProduction = process.env.NODE_ENV;
      console.log("====================================");
      console.log(isProduction);
      console.log("====================================");

      if (process.env.NODE_ENV === "production") {
        this.setCookie(res, "JWT", token, {
          httpOnly: true,
          secure: true,
          domain: ".healthka.life",
          sameSite: "None",

          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        console.log("saving Jwt");

        this.setCookie(res, "doctor_name", doctor_name, {
          secure: true,
          domain: ".healthka.life",
          sameSite: "None",
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        if (clinicResult.length > 0) {
          const clinic_name = clinicResult[0].clinic_name;
          this.setCookie(res, "clinic_name", clinic_name, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            secure: true,
            domain: ".healthka.life",
            sameSite: "None",
          });
        }
      } else {
        this.setCookie(res, "JWT", token, {
          httpOnly: true,

          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        console.log("saving Jwt");

        this.setCookie(res, "doctor_name", doctor_name, {
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        if (clinicResult.length > 0) {
          const clinic_name = clinicResult[0].clinic_name;
          this.setCookie(res, "clinic_name", clinic_name, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          });
        }
      }

      return callBack({
        apiSuccess: 1,
        resSuccess: 1,
        message: "Login successful",
        user: user.doctor_id,
        doctorData: docResult,
        clinicAddress: clinicAddressResult,
        clinicData: clinicResult,
      });
    } catch (error) {
      console.error("Error during login:", error);
      return callBack({
        apiSuccess: 0,
        message: "An error occurred during login",
      });
    }
  }

  async GetDoctorById(doctor_profile: string, callBack: any) {
    try {
      const queryAsync = util.promisify(mysql_pool.query).bind(mysql_pool);

      // Query to fetch data from doctor_profile table
      const doctorQuery = `SELECT * FROM doctor_profile WHERE doctor_id=?`;
      const doctorData = await queryAsync({
        sql: doctorQuery,
        values: doctor_profile,
      });

      if (!doctorData) {
        return callBack({
          apiSuccess: 0,
          resSuccess: 0,
          error: "Server Error",
          message: "No doctor data found",
        });
      }

      // Query to fetch data from clinic_doctors table
      const clinicQuery = `SELECT * FROM clinic_doctors WHERE doctor_id=?`;
      const clinicDataResult = await queryAsync({
        sql: clinicQuery,
        values: doctor_profile,
      });

      const clinicData: { clinic_id: string }[] = Array.isArray(
        clinicDataResult
      )
        ? clinicDataResult.map((item: any) => ({ clinic_id: item.clinic_id }))
        : [];

      if (!clinicData || clinicData.length === 0) {
        return callBack({
          apiSuccess: 0,
          resSuccess: 0,
          error: "Server Error",
          message: "No clinic data found",
        });
      }

      // Extract clinic_id from clinicData
      const clinicId = clinicData[0].clinic_id;

      // Query to fetch data from address table using clinic_id
      const AddressQuery = `SELECT * FROM address where doctor_id=?`;
      const addressData = await queryAsync({
        sql: AddressQuery,
        values: doctor_profile,
      });

      if (!addressData) {
        return callBack({
          apiSuccess: 0,
          resSuccess: 0,
          error: "Server Error",
          message: "No Address found",
        });
      }

      const ClinicAddressQuery = `SELECT * FROM clinic_address where clinic_id=?`;
      const clinicAddressData = await queryAsync({
        sql: ClinicAddressQuery,
        values: clinicId,
      });
      if (!clinicAddressData) {
        return callBack({
          apiSuccess: 0,
          resSuccess: 0,
          error: "Server Error",
          message: "No Address found",
        });
      }
      // Both queries executed successfully, return the data
      return callBack({
        apiSuccess: 1,
        resSuccess: 1,
        doctorData: doctorData,
        clinicData: clinicDataResult,
        address: addressData,
        clinicAddress: clinicAddressData,
        message: "Data found successfully",
      });
    } catch (error) {
      console.error("Error during fetching doctor data:", error);
      return callBack({
        apiSuccess: 0,
        message: "An error occurred while fetching doctor data",
      });
    }
  }

  //Not in use right now

  // async GetAllDoctorClinic(doctor_id: String, callBack: any) {
  //   try {
  //     const query = `Select * from clinic_doctors where doctor_id=?`;
  //     mysql_pool.query(query, doctor_id, (error, result) => {
  //       if (error) {
  //         return callBack({
  //           apiSuccess: 0,
  //           resSuccess: 0,
  //           error: error,
  //           message: "Unable to Input data",
  //         });
  //       }
  //       if (result.length === 0) {
  //         return callBack({
  //           apiSuccess: 1,
  //           resSuccess: 0,
  //           result: result,
  //           message: "No data found",
  //         });
  //       }
  //       console.log(result);

  //       if (result) {
  //         return callBack({
  //           apiSuccess: 1,
  //           resSuccess: 1,
  //           result: result,
  //           message: "Data inserted Successfully",
  //         });
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error during login:", error);
  //     return callBack({
  //       apiSuccess: 0,
  //       message: "An error occurred ",
  //     });
  //   }
  // }

  async PredictionApi(data: Doctors_patient) {
    const Query = `SELECT patient_name,phone_number,age,gender FROM  doctors_patients where(patient_name LIKE ? OR phone_number LIKE ?) AND doctor_id =?`;
  }
}
export default Doctor_profile_repo;
