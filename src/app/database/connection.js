// db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('coffeeshop', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', // change this to your DBMS, e.g., 'postgres', 'sqlite', etc.
});

module.exports = sequelize;
