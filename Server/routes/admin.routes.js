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

router.use(authMiddleware);

router.get("/users", roleMiddleware(["admin","doctor"]),getAllUsers);

router.get("/users/id/:id",roleMiddleware(["admin","doctor"]) ,getUserById);

router.get("/users/email/:email", roleMiddleware(["admin","doctor"]),getUserByEmail);

router.patch("/users/id/:id",updateUser);

router.delete("/users/id/:id", roleMiddleware("admin"),deleteUser);
router.get("/patients", getAllPatients);
router.get("/patients/:id", getPatientById);
router.post("/patients", createPatient);
router.put("/patients/:id", updatePatient);
router.delete("/patients/:id", deletePatientOnly);
module.exports = router;
