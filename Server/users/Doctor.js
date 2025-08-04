const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: "doctor",
    },
     image: {
      type: String,
      default: " ",
    },
    phone: String,
    gender: String,
    specialization: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
