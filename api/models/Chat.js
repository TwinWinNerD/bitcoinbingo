/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    user: {
      type: 'STRING',
      required: true
    },

    type: {
      type: 'STRING',
      required: false
    },

    body: {
      type: 'STRING',
      required: true,
      maxLength: 200
    }
  }
};

