const Sequelize = require('sequelize');
const db = new Sequelize('postgres://shmuel:Unix123455@localhost:5432/extended', {
    logging: false
});

module.exports = db;
