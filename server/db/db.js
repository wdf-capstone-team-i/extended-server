const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/extended');

module.exports = db;
