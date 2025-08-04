const MedicalTest = require("../models/Medicaltest");
const Doctor = require("../users/Doctor");
const Patient = require("../users/Patient");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const addMedicalTest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }
  try {
    const { testType, result, patient_id, doctor_id } = req.body;
    const foundPatient = await Patient.findOne({
      _id: patient_id,
    });
    if (!foundPatient)
      return res.status(404).json({ message: "Patient not found" });
    const foundDoctor = await Doctor.findOne({ _id: doctor_id });
    if (!foundDoctor)
      return res.status(404).json({ message: "Doctor not found" });
    const test = new MedicalTest({
      testType,
      result,
      patient_id,
      doctor_id,
    });

    await test.save();
    res.status(201).json(test);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding medical test", error: error.message });
  }
};
const getAllMedicalTests = async (req, res) => {
  try {
    const tests = await MedicalTest.find()
      .populate("doctor_id", "name email phone")
      .populate("patient_id", "name email phone");
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medical tests", error });
  }
};
const getMedicalTestById = async (req, res) => {
  try {
    const test = await MedicalTest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ message: "Medical test not found" });
    }

    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medical test", error });
  }
};
const deleteMedicalTest = async (req, res) => {
  try {
    const test = await MedicalTest.findByIdAndDelete(req.params.id);

    if (!test) {
      return res.status(404).json({ message: "Medical test not found" });
    }

    res.status(200).json({ message: "Medical test deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting medical test", error });
  }
};
const getMyMedicalTests = async (req, res) => {
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
    console.log("User ID:", userId);
    console.log("Query being used:", query);

    const tests = await MedicalTest.find(query)
      .populate("doctor_id", "name email phone")
      .populate("patient_id", "name email phone");
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching your medical tests",
      error: error.message || error,
    });
  }
};

module.exports = {
  addMedicalTest,
  getAllMedicalTests,
  getMedicalTestById,
  deleteMedicalTest,
  getMyMedicalTests,
};
