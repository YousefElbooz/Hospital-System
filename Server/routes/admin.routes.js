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

router.use(authMiddleware);

router.get("/users", roleMiddleware("admin"),getAllUsers);

router.get("/users/id/:id",roleMiddleware("admin") ,getUserById);

router.get("/users/email/:email", roleMiddleware("admin"),getUserByEmail);

router.patch("/users/id/:id",updateUser);

router.delete("/users/id/:id", roleMiddleware("admin"),deleteUser);

module.exports = router;
