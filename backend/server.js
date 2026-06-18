require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const passport = require('./config/passport'); // Handles Google OAuth login
const sequelize = require("./config/db"); // Our MySQL database connection manager
require("./models"); // This will load our Database Tables (User, BootcampPost)

const authRoutes = require('./routes/authRoutes'); // Routes related to logging in
const bootcampRoutes = require('./routes/bootcampRoutes'); // Routes for uploading/fetching posts
const auditRoutes = require('./routes/auditRoutes'); // Routes for audit history logs

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize()); // We will uncomment this when we build the authentication layer.

// If someone goes to http://localhost:5000/uploads/photos/photo.jpg, express apna uploads folder dekhega
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/auth', authRoutes);
app.use('/api/bootcamp', bootcampRoutes);
app.use('/api/audit', auditRoutes);

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
