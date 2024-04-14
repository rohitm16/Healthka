import mongoose from "mongoose";
import FollowUp from "../class/recordsClass";

const Schema = new mongoose.Schema({
  follow_up_date: {
    type: Date,
    required: true,
  },
  follow_up_time: {
    type: String,
    required: true,
  },
  doctor_id: {
    type: String,
    required: true,
  },
  patient_id: {
    type: String,
    required: true,
  },
  clinic_id: {
    type: String,
    required: true,
  },
  prescription_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Records",
  },
});

const ForFollowup = mongoose.model<FollowUp>("follow_up", Schema);

export default ForFollowup;
