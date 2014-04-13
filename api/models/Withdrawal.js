/**
 * Withdrawal.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        recipientAddress: {
            type: 'STRING'
        },

        amount: {
            type: 'INTEGER'
        },

        withdrawalType: {
            type: 'STRING'
        },

        user: {
            model: 'user'
        }

	}

};
