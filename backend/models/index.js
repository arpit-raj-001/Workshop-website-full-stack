//connecting the models together , taaki database ko pata chale how they relate to one another

const sequelize = require("../config/db");
const User = require("./User");
const BootcampPost = require("./BootcampPost");

//ek bootcamp post ek hi admin post kr skta , like author of post
BootcampPost.belongsTo(User, { as: "author", foreignKey: "createdBy" });

//ek user can create many posts
User.hasMany(BootcampPost, { foreignKey: "createdBy" });
module.exports = { sequelize, User, BootcampPost };
