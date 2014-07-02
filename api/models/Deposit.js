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

        depositType: {
            type: 'STRING',
            required: true
        },

        user: {
            model: 'user',
            required: true
        }

	}

};
