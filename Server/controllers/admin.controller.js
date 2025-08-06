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
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    let user = (await Doctor.findById(id)) || (await Patient.findById(id));

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
    let user =
      (await Doctor.findOne({ email })) || (await Patient.findOne({ email }));

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
    if (!user) user = await Patient.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    Object.assign(user, updates);
    await user.save();

    res.status(200).json({ message: "User updated", user });
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

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
};
