const Sequelize = require('sequelize')
const db = require('../db')

const Site = db.define('sites', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    domain: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Site