import { Doctors_patient } from "./patientsClass";

export interface Records extends Doctors_patient {
  prescription_id: String;
  case_history: String;
  systematic_history: String;
  created_at: Date;
  vitals: Vitals[];
  diagnosis: Diagnosis[];
  medicine: Medicine[];
  general_advice: String;
  follow_status: String;
  follow_up: Boolean;
  clinic_id: String;
  surgery_advice: String;
  referral: String;
  prescription_date: String;
  prescription_time: String;
}

interface Vitals {
  vites_name: string;
  vite_result: string;
}

interface Diagnosis extends DiagnosisHistory {
  test_name: String;
  test_type: String;
  advice: String;
}

interface DiagnosisHistory {
  history: String;
}
interface Medicine {
  medicine_name: String;
  medicine_type: String;
  dose: String;
  advice: String;
  time: String;
  duration: String;
}

export default interface FollowUp {
  follow_up_date: Date;
  follow_up_time: String;
  doctor_id: string;
  patient_id: string;
  clinic_id: string;
  prescription_id: string;
}

export interface BillRecords {
  invoice_number: string;
  prescription_id: string;
  patient_id: string;

  doctor_id: string;
  clinic_id: string;
  bill_date: string;
  bill_time: string;
  service: Service[];
}

interface Service {
  service_name: string;
  service_charges: number;
}
