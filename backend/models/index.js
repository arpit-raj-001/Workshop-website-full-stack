//connecting the models together , taaki database ko pata chale how they relate to one another

const sequelize = require("../config/db");
const User = require("./User");
const BootcampPost = require("./BootcampPost");
const Doubt = require("./Doubt");
const AuditLog = require("./AuditLog");
const AssignmentCompletion = require("./AssignmentCompletion");

//ek bootcamp post ek hi admin post kr skta , like author of post
BootcampPost.belongsTo(User, { as: "author", foreignKey: "createdBy" });

//ek user can create many posts
User.hasMany(BootcampPost, { foreignKey: "createdBy" });

// assignment track krne ke liye
User.hasMany(AssignmentCompletion, { foreignKey: "studentId" });
AssignmentCompletion.belongsTo(User, { foreignKey: "studentId" });

BootcampPost.hasMany(AssignmentCompletion, { foreignKey: "assignmentId" });
AssignmentCompletion.belongsTo(BootcampPost, { foreignKey: "assignmentId" });

module.exports = {
  sequelize,
  User,
  BootcampPost,
  Doubt,
  AuditLog,
  AssignmentCompletion,
};
