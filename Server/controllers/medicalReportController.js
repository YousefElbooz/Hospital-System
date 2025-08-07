const MedicalReport = require("../models/Medicalreport");
const MedicalTest = require("../models/Medicaltest");
const mongoose = require("mongoose");

const createMedicalReport = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const {
      patient,
      doctor,
      reportTitle,
      content,
      attachmentUrl,
      relatedTests,
      reportDate,
    } = req.body;

    console.log('Parsed fields:', {
      patient,
      doctor,
      reportTitle,
      content: content ? 'Content provided' : 'No content',
      attachmentUrl: attachmentUrl || 'No attachment URL',
      relatedTests: relatedTests ? `Array of ${relatedTests.length} tests` : 'No tests',
      reportDate: reportDate || 'No date provided'
    });

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
    console.error('Error in createMedicalReport:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...error
    });
    
    res.status(500).json({
      message: "Error creating medical report",
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      code: error.code,
      name: error.name
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

/**
 * @desc    Get medical reports for a specific patient (for doctors/admins)
 * @route   GET /api/medical-reports/patient/:patientId
 * @access  Private (Doctor/Admin)
 *
 * This function retrieves all medical reports for a specific patient.
 * It performs the following steps:
 * 1. Validates the patient ID
 * 2. Checks user authorization
 * 3. Fetches and populates the medical reports with related data
 * 4. Returns the reports in a structured format
 */
const getPatientMedicalReports = async (req, res) => {
  try {
    // Extract patient ID from request parameters
    const { patientId } = req.params;

    // Validate that the provided patient ID is a valid MongoDB ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(patientId);
    if (!isValidObjectId) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID format",
      });
    }

    // Check user authorization
    // Only allow access if the user is an admin, doctor, or the patient themselves
    const isAuthorized =
      req.user.role !== "patient" || req.user.id === patientId;
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not authorized to view these reports.",
      });
    }

    console.log(`[INFO] Fetching medical reports for patient ID: ${patientId}`);

    // Define the query to find reports for the specified patient
    const query = { patient: patientId };

    // Define population options to include related data
    const populationOptions = [
      {
        path: "doctor",
        select: "name email",
        model: "Doctor",
        // Add error handling for population
        options: { lean: true },
      },
      {
        path: "patient",
        select: "name email",
        model: "Patient",
        options: { lean: true },
      },
      {
        path: "relatedTests",
        select: "testName status testDate",
        model: "MedicalTest",
        options: { lean: true },
      },
    ];

    // Execute the query with population and sorting
    const reports = await MedicalReport.find(query)
      .populate(populationOptions)
      .sort({ reportDate: -1 })
      .lean();

    // Log results for debugging purposes
    const reportCount = reports.length;
    console.log(
      `[SUCCESS] Found ${reportCount} reports for patient ${patientId}`
    );

    // Return the reports with a success response
    return res.status(200).json({
      success: true,
      count: reportCount,
      data: reports,
    });
  } catch (error) {
    // Log the full error for debugging
    console.error("[ERROR] Failed to fetch patient medical reports:", {
      error: error.message,
      stack: error.stack,
      patientId: req.params.patientId,
      timestamp: new Date().toISOString(),
    });

    // Return a user-friendly error response
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching medical reports",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get medical tests for the logged-in user (doctor or patient)
 * @route   GET /api/medical-reports/my-tests
 * @access  Private
 */
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
  getPatientMedicalReports,
  getMyMedicalTests,
};
