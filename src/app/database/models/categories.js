const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const Category = sequelize.define('Category', {
  CategoryId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  CategoryName: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'categories',
  timestamps: false
});

module.exports = Category;
