const { DataTypes } = require('sequelize');
const sequelize = require('../connection');
const Receipt = require('./receipt');
const Product = require('./products');

const ReceiptDetail = sequelize.define('ReceiptDetail', {
  ReceiptId: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    references: {
      model: Receipt,
      key: 'ReceiptId'
    },
    onDelete: 'CASCADE'
  },
  ProductId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Product,
      key: 'ProductId'
    },
    onDelete: 'CASCADE'
  },
  ProductQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ProductPrice: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  }
}, {
  tableName: 'receiptdetail',
  timestamps: false
});

module.exports = ReceiptDetail;
