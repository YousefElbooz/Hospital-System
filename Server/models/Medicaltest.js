const mongoose = require("mongoose");

const medicalTestSchema = new mongoose.Schema({
  testType: {
    type: String,
    required: true,
  },
  result: {
    type: String,
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
});

module.exports =
  mongoose.models.MedicalTest ||
  mongoose.model("MedicalTest", medicalTestSchema);
