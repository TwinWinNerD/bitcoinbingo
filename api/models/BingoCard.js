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
      var obj = this.toObject();

      obj.squares = BingoCardService.generateSquares(obj.game.serverSeed, obj.clientSeed, obj.id);

      return obj;
    }
  }
};
