import { Doctors_patient } from "../class/patientsClass";
import ManagePatients from "../repo/patientRepo";

export class PatientProfile {
  repo: ManagePatients;

  constructor() {
    this.repo = new ManagePatients();
  }

  // Will remove this service from here and will add this on recordsServices.ts
  //Living this for right now till test , then if needed will remove this
  async CreatePatient(data: Doctors_patient) {
    try {
      const createPatient = new Promise((resolve, rejects) => {
        this.repo.CreatePatient(data, (response: any) => {
          if (response.apiSuccess === 1) {
            return resolve(response);
          } else {
            return rejects(response);
          }
        });
      });
      return createPatient;
    } catch (error: any) {
      throw new Error(`Database connection error ${error.message} `);
    }
  }

  async UpdatePatientData(data: Doctors_patient) {
    try {
      const updatePatient = new Promise((resolve, reject) => {
        this.repo.UpdatePatient(data, (response: any) => {
          if (response.apiSuccess === 1) {
            resolve(response);
          } else {
            reject(response);
          }
        });
      });
      return await updatePatient; // Wait for the promise to resolve
    } catch (error: any) {
      throw new Error(`Database connection error ${error.message}`);
    }
  }

  async GetPatientByDoctorID(doctorId: string, patientId: string) {
    try {
      const getPatientByDoctorId = new Promise((resolve, reject) => {
        this.repo.GetPatientByDoctorID(doctorId, patientId, (response: any) => {
          if (response.apiSuccess === 1) {
            resolve(response);
          } else {
            reject(response);
          }
        });
      });
      return getPatientByDoctorId;
    } catch (error: any) {
      throw new Error(`Database connection error ${error.message} `);
    }
  }
  //Doctors_patient change it in production
  async GetAllPatient(
    doctor_id: string,
    clinic_id: string,
    page: number,
    pageSize: number
  ) {
    try {
      const response = await this.repo.GetAllPatient(
        doctor_id,
        clinic_id,
        page,
        pageSize
      );
      if (response.apiSuccess === 1) {
        return response;
      }
    } catch (error: any) {
      throw new Error(`Database connection error ${error.message} `);
    }
  }
}
