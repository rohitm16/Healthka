import { Response, response } from "express";
import {
  Address,
  Doctor_profile,
  Clinic_profile,
  Clinic_address,
  Clinic_doctors,
} from "../class/doctorClass";
import Doctor_profile_repo from "../repo/doctorRepo";
import { Auth } from "../class/authClass";
import { log } from "console";

class doctor_profile_service {
  repo: Doctor_profile_repo;

  constructor() {
    this.repo = new Doctor_profile_repo();
  }

  async CreateDoctorProfile(data: Doctor_profile, data2: Address) {
    try {
      const doctorId = Math.floor(1000 + Math.random() * 9000);
      data.doctor_id = JSON.stringify(doctorId);
      const address = Math.floor(1000 + Math.random() * 9000);
      data2.address_id = JSON.stringify(address);

      const createDoctor = await new Promise((resolve, reject) => {
        this.repo.CreatingDoctorProfile(data, data2, (response: any) => {
          if (response.apiSuccess === 1) {
            console.log("It is working fine here");

            return resolve(response);
          }
          console.log("====================================");
          console.log(response);
          console.log("====================================");
          return reject(response);
        });
      });

      return createDoctor;
    } catch (error) {
      console.error("Error creating doctor profile", error);
      throw error;
    }
  }

  async CreateClinicProfile(
    clinic_profile: Clinic_profile,
    clinic_address: Clinic_address,
    clinicDoctors: Clinic_doctors
  ) {
    try {
      const clinic_id = Math.floor(1000 + Math.random() * 9000);
      clinic_profile.clinic_id = JSON.stringify(clinic_id);
      const address_id = Math.floor(1000 + Math.random() * 9000);
      clinic_address.address_id = JSON.stringify(address_id);
      const id = Math.floor(1000 + Math.random() * 9000);
      clinicDoctors.id = JSON.stringify(id);
      clinicDoctors.clinic_id = clinic_profile.clinic_id;

      const response = await new Promise((resolve, reject) => {
        this.repo.ClinicData(
          clinic_profile,
          clinic_address,
          clinicDoctors,
          (response: any) => {
            if (response.apiSuccess === 1) {
              resolve(response);
            } else {
              reject(response);
            }
          }
        );
      });

      // Return the response
      return response;
    } catch (error) {
      // Handle any errors
      console.error("Error creating clinic profile", error);
      throw error;
    }
  }
  //Clinic address (will be removed before production)

  // async CreateClinicAddress(clinic_address: Clinic_address) {
  //   const clinicAddress = await new Promise((resolve, reject) => {
  //     this.repo.ClinicAddress(clinic_address, (response: any) => {
  //       if (response.apiSuccess === 1) {
  //         resolve(response);
  //       } else {
  //         reject(response.error);
  //       }
  //     });
  //   });
  //   return clinicAddress;
  // }

  async CreateAuth(data: Auth) {
    try {
      const response = await new Promise((resolve, reject) => {
        console.log(data);

        this.repo.Auth(data, (response: any) => {
          if (response.apiSuccess === 1) {
            resolve(response);
          } else {
            reject(response);
          }
        });
      });
      return response;
    } catch (error) {
      console.error("Error creating authentication", error);
    }
  }
  // async Login(auth: Auth, res: Response) {
  //   try {
  //     const real = await new Promise((resolve, reject) => {
  //       this.repo.Login(auth, res, (response: any) => {
  //         console.log("Response from repo:", response);
  //         if (response.apiSuccess === 0) {
  //           return reject(response);
  //         } else {
  //           resolve(response);
  //         }
  //       });
  //     });
  //     console.log(real, "this should work");

  //     return real;
  //   } catch (error: any) {
  //     throw new Error(error);
  //   }
  // }

  async GetClinicDoctor(data: string) {
    try {
      // Execute GetDoctorById asynchronously

      const doctorData = await new Promise((resolve, reject) => {
        this.repo.GetDoctorById(data, (response: any) => {
          if (response.apiSuccess === 1) {
            resolve(response);
          } else {
            reject(response);
          }
        });
      });

      // Combine and return both results
      return doctorData;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default doctor_profile_service;
