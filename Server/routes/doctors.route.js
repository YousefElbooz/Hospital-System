const router = require("express").Router();
const doctorController = require("../controllers/doctors.controller");

router.get("/", doctorController.getAllDoctors);
router.get("/:id", doctorController.getDoctorById);
router.post("/", doctorController.createDoctor);
router.put("/:id", doctorController.updateDoctor);
router.delete("/:id", doctorController.deleteDoctor);

module.exports = router;
