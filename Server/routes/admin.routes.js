const router = require("express").Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,      
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatientOnly,
} = require("../controllers/admin.controller");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.use(authMiddleware, roleMiddleware("admin"));

router.get("/users", getAllUsers);

router.get("/users/id/:id", getUserById);

router.get("/users/email/:email", getUserByEmail);

router.put("/users/id/:id", updateUser);

router.delete("/users/id/:id", deleteUser);
router.get("/patients", getAllPatients);
router.get("/patients/:id", getPatientById);
router.post("/patients", createPatient);
router.put("/patients/:id", updatePatient);
router.delete("/patients/:id", deletePatientOnly);
module.exports = router;
