const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); //database import krna padega jo db.js me bnaya tha

const BootcampPost = sequelize.define("BootcampPost", {
  type: {
    type: DataTypes.ENUM("photo", "video", "message", "poll", "assignment"),
    allowNull: false,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  // Stores an array of URLs (or a single string for legacy posts)
  mediaUrl: {
    type: DataTypes.JSON,
    allowNull: true,
  },

  tags: {
    type: DataTypes.JSON,
    allowNull: true,
  },

  pollOptions: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

//baad me create or fetch ke liye export kr lena
module.exports = BootcampPost;
