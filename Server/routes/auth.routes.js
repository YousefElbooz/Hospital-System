  const   router = require("express").Router();
  const authMiddleware = require("../middlewares/authMiddleware");
  const multer = require('multer');
  const path = require('path');
  const { body } = require("express-validator");
  const {
    login,
    signupDoctor,
    signupPatient,
    getProfile,
    adminLogin,
    updateProfile,
    uploadImage
  } = require("../controllers/auth.controller");

  const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  const upload = multer({ storage });

  router.put("/profile/image", authMiddleware, upload.single('image'), uploadImage);
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
  router.put("/profile", authMiddleware, updateProfile);
  router.get("/profile", authMiddleware, getProfile);
  router.post("/adminLogin", adminLogin);

  module.exports = router;
