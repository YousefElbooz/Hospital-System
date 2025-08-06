const Doctor = require("../users/Doctor");
const Patient = require("../users/Patient");

const getAllUsers = async (req, res) => {
  try {
    const doctors = await Doctor.find({}, "-password");
    const patients = await Patient.find({}, "-password");

    res.status(200).json({
      doctors,
      patients,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
;
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    let user = await Doctor.findById(id) || await Patient.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    let user = await Doctor.findOne({ email }) || await Patient.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    let user = await Doctor.findById(id);
    if (user) {
      Object.assign(user, updates);
      await user.save();
      return res.status(200).json({ message: "Doctor updated", user });
    }

    user = await Patient.findById(id);
    if (user) {
      Object.assign(user, updates);
      await user.save();
      return res.status(200).json({ message: "Patient updated", user });
    }

    res.status(404).json({ message: "User not found" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    let user = await Doctor.findById(id);
    if (user) {
      await user.deleteOne();
      return res.status(200).json({ message: "Doctor deleted" });
    }

    user = await Patient.findById(id);
    if (user) {
      await user.deleteOne();
      return res.status(200).json({ message: "Patient deleted" });
    }

    res.status(404).json({ message: "User not found" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET all patients only
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({}, "-password");
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET patient by ID
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id, "-password");
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST create new patient
const bcrypt = require("bcryptjs"); // ✅ Add this at the top

const createPatient = async (req, res) => {
  try {
    const { name, email, phone, gender, image, password } = req.body;

    if (!password || password.length < 4) {
      return res.status(400).json({ message: "Password is required and must be at least 4 characters." });
    }

    const existing = await Patient.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10); // ✅ No crash now

    const newPatient = new Patient({
      name,
      email,
      phone,
      gender,
      image,
      password: hashedPassword,
    });

    await newPatient.save();
    res.status(201).json({ message: "Patient created", patient: newPatient });
  } catch (err) {
    console.error("❌ createPatient error:", err); // ✅ Better logging
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// PUT update patient by ID
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    Object.assign(patient, req.body);
    await patient.save();
    res.status(200).json({ message: "Patient updated", patient });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE patient by ID
const deletePatientOnly = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    await patient.deleteOne();
    res.status(200).json({ message: "Patient deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
   getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatientOnly
};
