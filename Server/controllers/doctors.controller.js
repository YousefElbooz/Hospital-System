const Doctor = require("../users/Doctor");
const bcrypt = require("bcryptjs");

// Get all doctors (without passwords)
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get doctor by ID (without password)
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new doctor (with password hashing)
exports.createDoctor = async (req, res) => {
  try {
    const { name, email, password, phone, gender, specialization, image } = req.body;

    const exists = await Doctor.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

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
    res.status(201).json({ message: "Doctor created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update a doctor (optional: hash password if provided)
exports.updateDoctor = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await Doctor.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updated) return res.status(404).json({ message: "Doctor not found" });

    res.json({ message: "Doctor updated", doctor: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const deleted = await Doctor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Doctor not found" });

    res.json({ message: "Doctor deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
