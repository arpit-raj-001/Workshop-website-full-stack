const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Doubt = sequelize.define("Doubt", {
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "resolved"),
    defaultValue: "pending",
  },
});

User.hasMany(Doubt, { as: "AskedDoubts", foreignKey: "studentId" });
Doubt.belongsTo(User, { as: "Student", foreignKey: "studentId" });

User.hasMany(Doubt, { as: "AnsweredDoubts", foreignKey: "answeredByAdminId" });
Doubt.belongsTo(User, { as: "Admin", foreignKey: "answeredByAdminId" });

module.exports = Doubt;
