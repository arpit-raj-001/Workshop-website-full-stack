const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// One table handles all three content types in the bootcamp section.
// "type" tells you whether it's a photo, video, or message.
// - photo/video posts use mediaUrl (path to the uploaded file)
// - message posts use content (plain text)
const BootcampPost = sequelize.define('BootcampPost', {
  type: {
    type: DataTypes.ENUM('photo', 'video', 'message'),
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
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = BootcampPost;
