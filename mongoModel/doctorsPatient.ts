import { timeStamp } from "console";
import mongoose from "mongoose";

const doctorsPatient = new mongoose.Schema({
  doctor_id: {
    type: String,
    require: [true, "Doctor id is required field "],
  },
  patient_id: {
    type: String,
    require: [true, "Patient id is required field"],
  },
  patient_name: {
    type: String,
    require: true,
  },
  phone_number: {
    type: String,
    require: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  age: {
    type: Number,
    require: true,
  },
  gender: {
    type: String,
    require: true,
    default: "Male",
  },
  clinic_id: {
    type: String,
    require: true,
  },
});
doctorsPatient.set("timestamps", true);

export default mongoose.model("doctorsPatient", doctorsPatient);
