/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var bcrypt;

bcrypt = require('bcrypt');

module.exports = {

    attributes: {

        username: {
            type: 'STRING',
            unique: true,
            minLength: 3,
            required: true
        },

        email: {
            type: 'STRING',
            email: true,
            unique: true,
            required: false
        },

        password: {
            type: 'STRING'
        },

        clientSeed: {
            type: 'STRING',
            alphanumeric: true,
            required: false
        },

        bingoCards: {
            collection: 'bingoCard',
            via: 'user'
        },

        deposits: {
            collection: 'deposit',
            via: 'user'
        },

        withdrawals: {
            collection: 'withdrawal',
            via: 'user'
        },

        winners: {
            collection: 'winner',
            via: 'user'
        }
    },

    beforeCreate: function (user, next) {
        if (user.hasOwnProperty('password')) {
            bcrypt.hash(user.password, 10, function (err, hash) {
                user.password = hash;
                next(err, user);
            });
        } else {
            next(null, user);
        }
    },

    beforeUpdate: function (user, next) {
        if (user.hasOwnProperty('password')) {
            bcrypt.hash(user.password, 10, function (err, hash) {
                user.password = hash;
                next(err, user);
            });
        } else {
            next(null, user);
        }
    }

};