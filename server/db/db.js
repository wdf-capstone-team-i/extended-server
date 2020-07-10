const Sequelize = require('sequelize');
require('../../secrets')

const db = new Sequelize(process.env.DATABASE_URL || `postgres://localhost:5432/extended`, {
    logging: false
});

module.exports = db;
