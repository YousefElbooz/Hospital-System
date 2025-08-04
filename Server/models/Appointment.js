const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient", 
    required: true,
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor", 
    required: true,
  },
  appointment_date: {
    type: Date,
    required: true,
  },
  state: {
    type: String,
    default: "pending",
  },
});


module.exports = mongoose.model('Appointment', appointmentSchema);
