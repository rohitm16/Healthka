import { Doctor_profile } from "./doctorClass";

export interface Auth extends Doctor_profile {
  password: string;
  clinic_id: string;
  doctor_name: string;
}
