const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { body } = require("express-validator");
const {
  createMedicalReport,
  getAllMedicalReports,
  deleteMedicalReportById,
  getMedicalReportById,
  getMyMedicalTests,
} = require("../controllers/medicalReportController");

router.post(
  "/",
  [
    body("patient").notEmpty().withMessage("Patient ID is Required"),
    body("doctor_id").notEmpty().withMessage("Doctor id is Required"),
    body("doctor").notEmpty().withMessage("Doctor ID is Required"),
    body("reportTitle").notEmpty().withMessage("Report Tilte is Required"),
    body("content").notEmpty().withMessage("Content is Required"),
    body("attachmentUrl").notEmpty().withMessage("Attachment URL is Required")
  ],
  authMiddleware,
  roleMiddleware(["admin", "doctor"]),
  createMedicalReport
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "doctor"]),
  getAllMedicalReports
);
router.get(
  "/id/:id",
  authMiddleware,
  roleMiddleware(["admin", "doctor"]),
  getMedicalReportById
);
router.delete(
  "/id/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteMedicalReportById
);
router.get("/my-tests", authMiddleware, getMyMedicalTests);

module.exports = router;
