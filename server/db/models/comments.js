const Sequelize = require('sequelize')
const db = require('../db')

const Comment = db.define('comments', {
    text: {
        type: Sequelize.TEXT
    }
})

module.exports = Comment