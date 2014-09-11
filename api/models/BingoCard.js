/**
 * BingoCard.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    clientSeed: {
      type: 'STRING',
      maxLength: 20,
      notNull: true
    },

    game: {
      model: 'game',
      required: true
    },

    user: {
      model: 'user',
      required: true
    },

    toJSON: function () {
      var obj;

      obj = this.toObject();

      obj.squares = BingoCardService.generateSquares(obj.game.serverSeed, obj.clientSeed, obj.id);

      return obj;
    }

  }

};
