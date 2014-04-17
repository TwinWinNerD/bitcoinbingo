/**
 * Deposit.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        amount: {
            type: 'INTEGER',
            integer: true,
            required: true
        },

        type: {
            type: 'STRING',
            alpha: true,
            required: true
        },

        user: {
            model: 'user',
            required: true
        }

	}

};
