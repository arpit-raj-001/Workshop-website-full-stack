const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); //database import krna padega jo db.js me bnaya tha

const BootcampPost = sequelize.define("BootcampPost", {
  type: {
    type: DataTypes.ENUM("photo", "video", "message", "poll"),
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

  //im not storing the video in db as file size can be large , so everything should be stored in /uploads folder , we will use url to fetch from local server
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

//baad me create or fetch ke liye export kr lena
module.exports = BootcampPost;
