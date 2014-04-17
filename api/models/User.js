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
            required: true
        },

        email: {
            type: 'STRING',
            email: true,
            required: false
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
        },

        passports : {
            collection: 'Passport',
            via: 'user'
        }
    }

};