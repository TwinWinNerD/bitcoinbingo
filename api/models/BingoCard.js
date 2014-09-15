module.exports = {
  attributes: {
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

      obj.squares = BingoCardService.generateSquares(obj.game.serverSeed, obj.nonce);

      return obj;
    }
  }
};
