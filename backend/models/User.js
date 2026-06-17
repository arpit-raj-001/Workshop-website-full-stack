const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  googleId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  pfp: {
    type: DataTypes.STRING,
  },

  role: {
    type: DataTypes.ENUM("admin", "user"),
    defaultValue: "user",
  },
});

module.exports = User;
