import mongoose, { mongo } from "mongoose";

const BillSchema = new mongoose.Schema({
  invoice: {
    type: String,
    require: true,
    unique: true,
  },
  patient_id: {
    type: String,
    require: true,
  },

  doctor_id: {
    type: String,
    require: true,
  },
  clinic_id: {
    type: String,
    require: true,
  },
  services: [
    {
      service_name: {
        type: String,
        require: true,
      },
      service_charge: {
        type: Number,
        require: true,
      },
    },
  ],
  bill_date: {
    type: String,
    require: true,
  },
  bill_time: {
    type: String,
    require: true,
  },
  prescription_id: {
    type: String,
    require: true,
  },
});

const Bill = mongoose.model("Bill", BillSchema);

export default Bill;
