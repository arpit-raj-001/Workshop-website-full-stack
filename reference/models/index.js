const sequelize = require('../config/db');
const User = require('./User');
const BootcampPost = require('./BootcampPost');

// A bootcamp post was created by one admin user.
BootcampPost.belongsTo(User, { as: 'author', foreignKey: 'createdBy' });
User.hasMany(BootcampPost, { foreignKey: 'createdBy' });

module.exports = { sequelize, User, BootcampPost };
