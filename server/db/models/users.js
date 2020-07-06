const db = require('../db');
const Sequelize = require('sequelize');
const crypto = require('crypto');

const User = db.define('users', {
    firstname: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },

    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },

    password:{
        type: Sequelize.STRING,

        get(){
            return () => this.getDataValue('password');
        }
    },

    salt: {
        type: Sequelize.STRING,

        get() {
            return () => this.getDataValue('salt');
        }
    }
})

// Instance Method
User.prototype.correctPassword = function (candidatePwd){
    return User.encryptPassword(candidatePwd, this.salt()) === this.password();
}

// Class methods
User.generateSalt = function () {
    return crypto.randomBytes(16).toString('base64')
}

User.encryptPassword = function(plainText, salt){
    return crypto.createHash('RSA-SHA256')
        .update(plainText)
        .update(salt)
        .digest('hex');
}

// Hooks

const setSaltAndPassword = function(user){
    if(user.changed('password')){
        user.salt = User.generateSalt();
        user.password = User.encryptPassword(user.password(), user.salt());
    }
}

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);
User.beforeBulkCreate(users => {
    users.forEach(setSaltAndPassword);
})

module.exports = User;
