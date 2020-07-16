const Sequelize = require('sequelize')
const db = require('../db')

const Page = db.define('pages', {
    pageTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    url: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

module.exports = Page