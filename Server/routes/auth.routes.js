const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { body } = require("express-validator");
const {
  login,
  signupDoctor,
  signupPatient,
  getProfile,
  adminLogin,
} = require("../controllers/auth.controller");

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);
router.post(
  "/signup-doctor",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("gender")
      .isIn(["male", "female"])
      .withMessage("you must choose gender"),
    body("phone").notEmpty().withMessage("Phone Number is Required"),
    body("specialization").notEmpty().withMessage("specialization is required"),
  ],
  signupDoctor
);
router.post(
  "/signup-patient",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("gender")
      .isIn(["male", "female"])
      .withMessage("you must choose gender"),
    body("phone").notEmpty().withMessage("Phone Number is Required"),
    body("dateOfBirth").notEmpty().withMessage("Date Of Birth  is Required"),
  ],
  signupPatient
);
router.get("/profile", authMiddleware, getProfile);
router.post("/adminLogin", adminLogin);
module.exports = router;
