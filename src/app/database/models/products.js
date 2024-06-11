const { DataTypes } = require('sequelize');
const sequelize = require('../connection'); // Adjust the path as needed

const Product = sequelize.define('Product', {
  ProductId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ProductName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ProductPrice: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  ProductDescription: {
    type: DataTypes.STRING,
    allowNull: false
  },
  CategoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'products',
  timestamps: false
});

module.exports = Product;
