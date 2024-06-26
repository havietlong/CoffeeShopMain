const { DataTypes } = require('sequelize');
const sequelize = require('../connection');
const Employee = require('./employee');
const Customer = require('./customer');

const Receipt = sequelize.define('Receipt', {
  ReceiptId: {
    type: DataTypes.CHAR(36),
    primaryKey: true
  },
  EmployeeId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    references: {
      model: Employee,
      key: 'EmployeeId'
    },
    onDelete: 'CASCADE'
  },
  CustomerId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    references: {
      model: Customer,
      key: 'CustomerId'
    },
    onDelete: 'CASCADE'
  },
  ReceiptDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  ReceiptTotal: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true
  },
  TableNum: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'receipts',
  timestamps: false
});

module.exports = Receipt;
