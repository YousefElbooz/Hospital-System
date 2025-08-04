const Appointment = require("../models/Appointment");
const Patient = require("../users/Patient");
const Doctor = require("../users/Doctor");
const mongoose = require("mongoose");

const createAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(patient_id) ||
      !mongoose.Types.ObjectId.isValid(doctor_id)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid patient_id or doctor_id" });
    }

    const patientExists = await Patient.findById(patient_id);
    if (!patientExists) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const doctorExists = await Doctor.findById(doctor_id);
    if (!doctorExists) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointment = new Appointment({
      patient_id,
      doctor_id,
      appointment_date,
      state: "pending",
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Error creating appointment", error });
  }
};

const getAppointmentById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid appointment ID format" });
  }
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("doctor_id", "name email ")
      .populate("patient_id", "name email ");
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointment", error });
  }
};
const getAppointmentsByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    let user = await Doctor.findOne({ email });
    let role = "doctor";

    if (!user) {
      user = await Patient.findOne({ email });
      role = "patient";
    }

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    const query =
      role === "doctor" ? { doctor_id: user._id } : { patient_id: user._id };

    const appointments = await Appointment.find(query)
      .populate("doctor_id", "name email ")
      .populate("patient_id", "name email ");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching appointments by email",
      error: error.message || error,
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment", error });
  }
};
const updateAppointmentStateAndDate = async (req, res) => {
  const { id } = req.params;
  const { newDate, newState } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid appointment ID" });
  }

  try {
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (newDate) {
      appointment.appointment_date = newDate;
    }

    if (newState) {
      appointment.state = newState;
    }

    await appointment.save();

    res.status(200).json({
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment", error });
  }
};


const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor_id", "name email ")
      .populate("patient_id", "name email ");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = {};
    if (userRole === "doctor") {
      query.doctor_id = new mongoose.Types.ObjectId(userId);
    } else if (userRole === "patient") {
      query.patient_id = new mongoose.Types.ObjectId(userId);
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
    const appointments = await Appointment.find(query)
      .populate("doctor_id", "name email ")
      .populate("patient_id", "name email ");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching your appointments",
      error: error.message || error,
    });
  }
};

module.exports = {
  getAllAppointments,
  createAppointment,
  getAppointmentById,
  deleteAppointment,
  getMyAppointments,
  getAppointmentsByEmail,
  updateAppointmentStateAndDate
};
