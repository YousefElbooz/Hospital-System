const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    gender: String,
    role: {
      type: String,
      default: "patient",
    },
    image: {
      type: String,
      default: " ",
    },
    dateOfBirth: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
