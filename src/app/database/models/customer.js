const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const Customer = sequelize.define('Customer', {
  CustomerId: {
    type: DataTypes.CHAR(36),
    primaryKey: true
  },
  CustomerName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  CustomerPhone: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  CustomerBirthday: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'customers',
  timestamps: false
});

module.exports = Customer;
