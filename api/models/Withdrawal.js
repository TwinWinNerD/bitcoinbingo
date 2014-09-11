/**
 * Withdrawal.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    recipientAddress: {
      type: 'STRING',
      alphanumeric: true,
      required: false
    },

    hash: {
      type: 'STRING',
      required: false
    },

    amount: {
      type: 'INTEGER',
      integer: true,
      required: true
    },

    withdrawalType: {
      type: 'STRING',
      required: true
    },

    user: {
      model: 'user',
      required: true
    }

  }

};
