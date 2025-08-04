const MedicalReport = require("../models/Medicalreport");
const MedicalTest = require("../models/Medicaltest");
const mongoose = require("mongoose");


const createMedicalReport = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      reportTitle,
      content,
      attachmentUrl,
      relatedTests,
      reportDate,
    } = req.body;

    // تأكيد إن كل test في relatedTests تابع لنفس الـ patient والـ doctor
    const tests = await MedicalTest.find({
      _id: { $in: relatedTests },
    });

    // تحقق من أن كل اختبار ينتمي لنفس الـ patient و doctor
    const invalidTest = tests.find(
      (test) =>
        test.patient_id.toString() !== patient ||
        test.doctor_id.toString() !== doctor
    );

    if (invalidTest) {
      return res.status(400).json({
        message:
          "One or more medical tests are not associated with the given patient or doctor.",
      });
    }

    const newReport = await MedicalReport.create({
      patient,
      doctor,
      reportTitle,
      content,
      attachmentUrl,
      relatedTests,
      reportDate,
    });

    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({
      message: "Error creating medical report",
      error: error.message || error,
    });
  }
};

const getAllMedicalReports = async (req, res) => {
  try {
    const reports = await MedicalReport.find()
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .populate("relatedTests");

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching medical reports",
      error: error.message || error,
    });
  }
};
const getMedicalReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await MedicalReport.findById(id)
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .populate("relatedTests");

    if (!report) {
      return res.status(404).json({ message: "Medical report not found" });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching medical report",
      error: error.message || error,
    });
  }
};
const deleteMedicalReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReport = await MedicalReport.findByIdAndDelete(id);
    if (!deletedReport) {
      return res.status(404).json({ message: "Medical report not found" });
    }

    res.status(200).json({ message: "Medical report deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting medical report",
      error: error.message || error,
    });
  }
};

const getMyMedicalTests = async (req, res) => {
try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = {};
    if (userRole === "doctor") {
      query.doctor = new mongoose.Types.ObjectId(userId);
    } else if (userRole === "patient") {
      query.patient = new mongoose.Types.ObjectId(userId);
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    const reports = await MedicalReport.find(query)
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .populate("relatedTests");

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching your medical reports",
      error: error.message || error,
    });
  }
};



module.exports = {
  createMedicalReport,
  getAllMedicalReports,
  deleteMedicalReportById,
  getMedicalReportById,
  getMyMedicalTests
};
