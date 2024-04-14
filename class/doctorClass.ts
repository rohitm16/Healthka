export interface Doctor_profile {
  doctor_id: String;
  first_name: String;
  last_name: String;
  DOB: String;
  gender: String;
  phone_number: String;
  email: String;
  qualification: String;
  specialization: String;
  personal_clinic: Boolean;
  experience: String;
  year_of_passing: String;
  college_name: String;
  profile_pic: String;
  NMC_doctor_id: String;
}

export interface Address {
  address_id: String;
  house_number: String;
  lane: String;
  address_one: String;
  landmark: String;
  city: String;
  state: String;
  pin_code: String;
  country: String;
  doctor_id: String;
}

export interface Clinic_profile {
  clinic_id: String;
  clinic_name: String;

  start_time: String;
  end_time: String;
  gst: String;
  clinic_phone_number: String;
  working_days: String;
  clinic_type: Number;
}

export interface Clinic_address {
  address_id: String;
  house_number: String;
  lane: String;
  address_one: String;
  landmark: String;
  city: String;
  state: String;
  pin_code: String;
  country: String;
  clinic_id: String;
}

export interface Clinic_doctors extends Clinic_profile, Doctor_profile {
  id: String;
  start_time: String;
  end_time: String;
  working_days: String;
}

interface Clinic extends Clinic_profile {
  clinic_status: Boolean;
  clinic_type: Number;
}

export interface BasicDoctorData extends Doctor_profile {
  clinic: Clinic[];
  last_login?: Date;
  last_logout?: Date;
}
