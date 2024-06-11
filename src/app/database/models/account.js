// models/Account.js
const { DataTypes } = require('sequelize');
const sequelize = require('../connection'); // Updated import
const Role = require('./roles');  // Assuming you have a Role model defined

const Account = sequelize.define('Account', {
  AccountId: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    allowNull: false,
  },
  AccountUsername: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  AccountPassword: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  RoleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'accounts',
  timestamps: false,
});

Account.belongsTo(Role, { foreignKey: 'RoleId', onDelete: 'CASCADE' });

module.exports = Account;
