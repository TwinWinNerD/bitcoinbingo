module.exports = {
  attributes: {
    minimumPlayers: {
      type: 'integer',
      integer: true,
      required: true
    },
    maximumPlayers: {
      type: 'integer',
      integer: true,
      required: true
    },
    maximumCards: {
      type: 'integer',
      integer: true,
      required: true
    },
    cardPrice: {
      type: 'integer',
      integer: true,
      required: true
    },
    jackpot: {
      type: 'integer',
      integer: true,
      defaultsTo: 0
    },
    houseEdge: {
      type: 'integer',
      defaultsTo: 1
    },
    tableType: {
      type: 'string',
      text: true,
      required: true
    },
    games: {
      collection: 'game',
      via: 'table'
    }
  }
};
