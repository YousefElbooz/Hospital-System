const Doctor = require("../users/Doctor");
const Patient = require("../users/Patient");
const Admin = require("../users/admin");
const { validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//تسجيل الدخول لكلا المستخدمين
const login = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }

  try {
    let user = await Doctor.findOne({ email });
    let role = "doctor";

    if (!user) {
      user = await Patient.findOne({ email });
      role = "patient";
    }

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    let name = user?.name;
    let img = user?.image;

    res.status(200).json({ token, role, userId: user._id, name, img });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
//انشاء حساب للدكتور
const signupDoctor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }
  try {
    const { name, email, password, phone, gender, specialization, image } =
      req.body;

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor)
      return res.status(400).json({ message: "This Email Is Already Used !!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      phone,
      gender,
      specialization,
      image,
    });

    await doctor.save();

    res
      .status(201)
      .json({ message: "Doctor Account Has Been Created Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
//انشاء حساب للمريض
const signupPatient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }
  try {
    const { name, email, password, phone, gender, dateOfBirth, image } =
      req.body;

    const existingPatient = await Patient.findOne({ email });
    if (existingPatient)
      return res.status(400).json({ message: "This Email Is Already Used !!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = new Patient({
      name,
      email,
      password: hashedPassword,
      phone,
      gender,
      dateOfBirth,
      image,
    });

    await patient.save();

    res
      .status(201)
      .json({ message: "Patient Account Has Been Created Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
//معلومات المستخدم
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let user;
    if (role === "doctor") {
      user = await Doctor.findById(userId).select("-password");
    } else if (role === "patient") {
      user = await Patient.findById(userId).select("-password");
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
//تسجيل الدخول للادمن
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    let name = admin?.username;
    let img = admin?.image;

    res.status(200).json({ token, role: "admin", adminId: admin._id,name,img });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login, signupDoctor, signupPatient, getProfile, adminLogin };
