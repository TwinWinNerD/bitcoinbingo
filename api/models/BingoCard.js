module.exports = {
  attributes: {
    clientSeed: {
      type: 'string',
      defaultsTo: ''
    },
    bought: {
      type: 'integer',
      defaultsTo: 0
    },
    nonce: {
      type: 'integer'
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
      var obj = this.toObject();

      obj.squares = BingoCardService.generateSquares(obj.game.serverSeed, obj.clientSeed, obj.nonce);

      return obj;
    }
  }
};
