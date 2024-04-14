export interface Patient_profile {
  patient_id: String;
  patient_name: String;
  age: Number;
  phone_number: String;
  gender: String;
}

export interface Doctors_patient extends Patient_profile {
  id: String;
  doctor_id: String;
  clinic_id: String;
}
export interface ApiResponse {
  apiSuccess: number;
  resSuccess: number;
  message: string;
  error?: any;
  data?: any;
  nhHits?: any;
}
