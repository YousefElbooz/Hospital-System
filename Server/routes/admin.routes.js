const router = require("express").Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
} = require("../controllers/admin.controller");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.use(authMiddleware, roleMiddleware("admin"));

router.get("/users", getAllUsers);

router.get("/users/id/:id", getUserById);

router.get("/users/email/:email", getUserByEmail);

router.put("/users/id/:id", updateUser);

router.delete("/users/id/:id", deleteUser);

module.exports = router;
