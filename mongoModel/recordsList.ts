import mongoose from "mongoose";
import followUp from "./followUp";
import { Records } from "../class/recordsClass";
import { FollowUpStatus } from "../enum/enum";
import FollowUp from "../class/recordsClass";

const Schema = new mongoose.Schema(
  {
    prescription_id: {
      type: String,
      unique: true,
      required: true,
    },
    patient_id: {
      type: String,
      required: [
        true,
        "Something went wrong. Please logout and re-login after a few minutes.",
      ],
      index: true,
    },
    patient_name: {
      type: String,
      required: [true, "Patient name is required field"],
    },
    phone_number: {
      type: String,
      required: [true, "Phone number is a required field"],
      minlength: 10,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },

    clinic_id: {
      type: String,
      required: true,
    },
    doctor_id: {
      type: String,
      required: [
        true,
        "Something went wrong. Please logout and re-login after a few minutes.",
      ],
      index: true,
    },
    case_history: {
      type: String,
    },

    vitals: {
      type: [
        {
          vites_name: String,
          vite_result: String,
        },
      ],
      default: [],
    },
    referral: String,
    diagnosis: [
      {
        test_name: String,
        test_type: String,
        advice: String,
      },
    ],
    diagnosis_history: String,
    medicine: {
      type: [
        {
          medicine_name: String,
          medicine_type: String,
          dose: String,
          dose_unit: String,
          advice: String,
          time: String,
          duration: String,
          duration_unit: String,
          dose_code: String,
        },
      ],
      default: [],
    },
    general_advice: String,
    // follow_up: {
    //   type: Boolean,
    //   default: false,
    // },

    FollowUpDate: {
      type: String,
    },
    FollowUpTime: {
      type: String,
    },
    prescription_date: {
      type: String,
      require: true,
    },
    prescription_time: {
      type: String,
      require: true,
    },

    // follow_status: {
    //   type: String,
    //   enum: Object.values(FollowUpStatus),
    //   default: FollowUpStatus.NotRequired,
    // },

    surgery_advice: String,
  },
  {
    timestamps: true,
  }
);

const RecordsModel = mongoose.model<Records>("Records", Schema);

export default RecordsModel;
