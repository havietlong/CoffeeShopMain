const { DataTypes } = require('sequelize');
const sequelize = require('../connection');
const Account = require('./account');

const Employee = sequelize.define('Employee', {
  EmployeeId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    primaryKey: true
  },
  EmployeeName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  EmployeePosition: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  EmployeeWorkingHour: {
    type: DataTypes.TINYINT,
    allowNull: false
  },
  AccountId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'employees',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci'
});

// Set up the foreign key relationship
Employee.belongsTo(Account, { foreignKey: 'AccountId', onDelete: 'CASCADE' });
Account.hasOne(Employee, { foreignKey: 'AccountId' });

module.exports = Employee;
