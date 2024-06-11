// models/Role.js
const { DataTypes } = require('sequelize');
const sequelize = require('../connection'); // Updated import

const Role = sequelize.define('Role', {
  RoleId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  RoleName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'role',
  timestamps: false,
});

module.exports = Role;
