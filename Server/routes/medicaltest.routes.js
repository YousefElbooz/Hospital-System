const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  addMedicalTest,
  getAllMedicalTests,
  getMedicalTestById,
  deleteMedicalTest,
  getMyMedicalTests,
} = require("../controllers/medicaltest.controller");

router.post(
  "/medical-tests",
  [
    body("testType").notEmpty().withMessage("Test Type is Required"),
    body("result").notEmpty().withMessage("Result is Required"),
    body("patient_id").notEmpty().withMessage("Patient id is Required"),
    body("doctor_id").notEmpty().withMessage("Doctor id is Required"),
  ],
  authMiddleware,
  roleMiddleware(["admin", "doctor"]),
  addMedicalTest
);
router.get(
  "/medical-tests",
  authMiddleware,
  roleMiddleware(["admin"]),
  getAllMedicalTests
);
router.get(
  "/medical-tests/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  getMedicalTestById
);
router.delete(
  "/medical-tests/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteMedicalTest
);
router.get(
  "/myMedicalTests",
  authMiddleware,
  roleMiddleware(["doctor", "patient"]),
  getMyMedicalTests
);

module.exports = router;
