const express = require("express");
const cors = require("cors"); // ✅ Add this line
const path = require('path');

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const appointmentRoutes = require("./routes/appointement.routes");
const medicalTestRoutes = require("./routes/medicaltest.routes");
const medicalReportRoutes = require("./routes/medicalReport.routes");
const doctorRoutes = require("./routes/doctors.route"); 
const connectDB = require("./connection/db");

const app = express();
const port = 4000;

app.use(cors({ origin: "http://localhost:4200", credentials: true })); // ✅ Allow Angular frontend
app.use(express.json());

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use(appointmentRoutes);
app.use(medicalTestRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/doctors", doctorRoutes);
app.use("/reports", medicalReportRoutes);

connectDB();

app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});
