const Sequelize = require('sequelize')
const db = require('../db')

const Comment = db.define('comments', {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    text: {
        type: Sequelize.TEXT
    }
})

module.exports = Comment