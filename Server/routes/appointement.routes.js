const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const validateAppointmentData = require("../middlewares/validateAppointment");
const {
  createAppointment,
  getAppointmentById,
  deleteAppointment,
  getAllAppointments,
  getMyAppointments,
  getAppointmentsByEmail,
  updateAppointmentStateAndDate,
} = require("../controllers/appointment.controller");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.post(
  "/appointments",
  authMiddleware,
  roleMiddleware(["admin", "patient"]),
  validateAppointmentData,
  createAppointment
);
router.get(
  "/appointments",
  authMiddleware,
  roleMiddleware(["admin"]),
  getAllAppointments
);
router.get(
  "/appointments/id/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  getAppointmentById
);
router.get(
  "/appointments/email/:email",
  authMiddleware,
  roleMiddleware(["admin"]),
  getAppointmentsByEmail
);
router.patch(
  "/appointments/id/:id",
  authMiddleware,
  roleMiddleware(["patient", "doctor"]),
  updateAppointmentStateAndDate
);
router.delete(
  "/appointments/id/:id",
  authMiddleware,
  deleteAppointment
);
router.get(
  "/myAppointments",
  authMiddleware,
  roleMiddleware(["doctor", "patient"]),
  getMyAppointments
);

module.exports = router;
