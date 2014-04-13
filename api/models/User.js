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
            type: 'STRING'
        },

        email: {
            type: 'STRING'
        },

        password: {
            type: 'STRING'
        },

        clientSeed: {
            type: 'STRING'
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
        },

        passports : {
            collection: 'Passport',
            via: 'user'
        },

        toJSON: function () {
            var obj = this.toObject();

            delete obj.password;

            return obj;
        },

        beforeCreate: function (user, cb) {
            bcrypt.genSalt(10, function (error, salt) {
                bcrypt.hash(user.password, salt, function (error, hash) {
                    if(error) {
                        console.log(error);
                        cb(error);
                    } else {
                        user.password = hash;
                        cb(null, user);
                    }
                });
            });
        }
    }

};