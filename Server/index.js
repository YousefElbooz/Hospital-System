const express = require("express");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const appointmentRoutes = require("./routes/appointement.routes");
const medicalTestRoutes = require("./routes/medicaltest.routes");
const medicalReportRoutes = require("./routes/medicalReport.routes");


const connectDB = require("./connection/db");

const app = express();

const port = 4000;

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use(appointmentRoutes);
app.use(medicalTestRoutes);
app.use("/reports", medicalReportRoutes);

connectDB();
// const Admin = require("./users/admin");

// const createInitialAdmin = async () => {
//   const exists = await Admin.findOne({ email: "admin@example.com" });

//   if (exists) {
//     console.log("⚠️ Admin already exists. Skipping creation.");
//     return;
//   }

//   const newAdmin = new Admin({
//     username: "mainAdmin",
//     email: "admin@example.com",
//     password: "admin123",
//     image:
//       "https://www.shutterstock.com/image-vector/admin-icon-strategy-collection-thin-600nw-2307398667.jpg", // ده هيتشفَّر تلقائيًا
//   });

//   await newAdmin.save(); // دا هو اللي بيفعّل pre('save') ويشفر الباسورد
//   console.log("✅ Admin created with hashed password");
// };

// connectDB().then(() => {
//   createInitialAdmin();
// });

app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});
