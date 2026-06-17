require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const passport = require('./config/passport');
const sequelize = require('./config/db');
require('./models'); // sets up model associations

const authRoutes = require('./routes/authRoutes');
const bootcampRoutes = require('./routes/bootcampRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Makes uploaded files reachable, e.g. http://localhost:5000/uploads/photos/123.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRoutes);
app.use('/api/bootcamp', bootcampRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Bootcamp backend is running' });
});

const PORT = process.env.PORT || 5000;

sequelize
  .sync() // creates/updates tables to match the models automatically
  .then(() => {
    console.log('Database connected and synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err.message);
    console.log('Starting the server anyway so you can see route errors. Fix your .env DB settings and restart.');
    app.listen(PORT, () => console.log(`Server running on port ${PORT} (no DB connection yet)`));
  });
