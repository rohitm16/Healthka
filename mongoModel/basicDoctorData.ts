import mongoose from "mongoose";

const { Schema } = mongoose;

const schema = new Schema({
  doctor_id: {
    type: String,
    unique: true,
    required: [true, "Doctor ID is required"],
  },
  doctor_name: {
    type: String,
    required: [true, "Doctor name is required"],
  },
  clinic: [
    {
      clinic_id: {
        type: String,
        required: true,
        unique: true,
      },
      clinic_name: {
        type: String,
        required: true,
      },
      clinic_status: {
        type: Boolean,
        default: true,
      },
      clinic_type: {
        type: Number,
        enum: [1, 2],
        default: 2,
        required: true,
      },
    },
  ],
  last_login: {
    type: Date,
  },
  last_logout: Date,
});

export default mongoose.model("basic_doctor_data", schema);
