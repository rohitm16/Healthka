import { Doctors_patient, Patient_profile } from "../class/patientsClass";
import { Records } from "../class/recordsClass";
import ManagePatients from "../repo/patientRepo";
import { ManageRecords } from "../repo/recordsRepo";
import { v4 as uuidv4 } from "uuid";

export class RecordServices {
  repo: ManageRecords;
  patient: ManagePatients;
  constructor() {
    this.repo = new ManageRecords();
    this.patient = new ManagePatients();
  }
  async CreatePrescription(
    data: Records,
    data2: Patient_profile & Doctors_patient
  ) {
    try {
      data.patient_id = uuidv4();
      data2.patient_id = data.patient_id;
      data.prescription_id = uuidv4();
      const createPrescription = new Promise((resolve, reject) => {
        this.patient.CreatePatient(data2, (response: any) => {
          if (response.apiSuccess === 1) {
            if (response.result !== undefined) {
              data.patient_id = response.result[0].patient_id;
            }

            this.repo.CreatePrescription(data, (response: any) => {
              if (response.apiSuccess === 1) {
                resolve(response);
              } else {
                reject(response);
              }
            });
          } else {
            reject(response);
          }
        });
      });
      return createPrescription;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async GetPrescriptionDataByDoctorId(
    data: string,
    page: number,
    pageSize: number
  ) {
    try {
      const getPrescriptionData = new Promise((resolve, reject) => {
        this.repo.GetPrescriptionDataByDoctorId(
          data,
          page,
          pageSize,
          (response: any) => {
            if (response.apiSuccess) {
              resolve(response);
            } else {
              reject(response);
            }
          }
        );
      });

      return await getPrescriptionData;
    } catch (error) {
      console.error("Error getting prescription data:", error);

      throw error;
    }
  }
  async GetPrescriptionById(data: String) {
    try {
      const individualistData = new Promise((resolve, reject) => {
        this.repo.GetPrescriptionById(data, (response: any) => {
          if (response.apiSuccess) {
            return resolve(response);
          } else {
            return reject(response);
          }
        });
      });
      return individualistData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
