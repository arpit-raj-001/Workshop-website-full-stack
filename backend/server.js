require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const passport = require("./config/passport");
const sequelize = require("./config/db");
require("./models");

const authRoutes = require("./routes/authRoutes");
const bootcampRoutes = require("./routes/bootcampRoutes");
const auditRoutes = require("./routes/auditRoutes");
const userRoutes = require("./routes/userRoutes");
const doubtRoutes = require("./routes/doubtRoutes");
const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize()); // We will uncomment this when we build the authentication layer.

// If someone goes to http://localhost:5000/uploads/photos/photo.jpg, express apna uploads folder dekhega
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRoutes);
app.use("/api/bootcamp", bootcampRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doubts", doubtRoutes);

// just testing
app.get("/", (req, res) => {
  res.json({ message: " working " });
});

const PORT = process.env.PORT || 5000; // abhi ke liuye local pe rkh rha , baad me env se le lenge

// Because you installed MySQL, we can now connect to it!
// sequelize.sync() connects to the DB and creates the tables automatically if they don't exist.
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("dbms connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("error:", err.message);
  });
