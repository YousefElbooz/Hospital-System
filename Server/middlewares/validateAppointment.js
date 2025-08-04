
const validateAppointmentData = (req, res, next) => {
  const { patient_id, doctor_id, appointment_date } = req.body;
  if (!patient_id || !doctor_id || !appointment_date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  next();
};

module.exports = validateAppointmentData;
