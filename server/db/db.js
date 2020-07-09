const Sequelize = require("sequelize");
// Change to a variable
const db = new Sequelize("postgres://localhost:5432/extended");

module.exports = db;
