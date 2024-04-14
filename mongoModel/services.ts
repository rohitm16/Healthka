import mongoose from "mongoose";

//Using mysql for this would be more flexible and reliable;
//Keeping the schema if needed in future;
const schema = new mongoose.Schema({
  doctor_id: {
    type: String,
    unique: true,
    require: true,
  },
  clinic_id: {
    type: String,
    unique: true,
    require: true,
  },
  services: [
    {
      service_name: {
        type: String,
        require: [true, "Please provide service name"],
      },
      charges: Number,
    },
  ],
});

export default mongoose.model("services", schema);
