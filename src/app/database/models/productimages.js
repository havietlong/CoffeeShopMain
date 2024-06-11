const { DataTypes } = require('sequelize');
const sequelize = require('../connection');
const Product = require('./products'); // Import the Product model

const ProductImage = sequelize.define('ProductImage', {
  ProductImageId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ProductImagePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ProductImageDescription: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ProductId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'ProductId'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'productimage',
  timestamps: false
});

module.exports = ProductImage;
