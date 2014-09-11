/**
 * Winner.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    winnerType: {
      type: 'STRING',
      alpha: true,
      required: true
    },

    amount: {
      type: 'INTEGER',
      required: true
    },

    bingoCard: {
      model: 'bingoCard',
      required: true
    },

    game: {
      model: 'game',
      required: true
    },

    user: {
      model: 'user',
      required: true
    }
  }
};
