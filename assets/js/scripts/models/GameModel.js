App.Game = DS.Model.extend({
    serverSeed: DS.attr(),
    numbers: DS.attr(),
    drawnNumbers: DS.attr(),
    gameStatus: DS.attr(),
    table: DS.belongsTo('table'),
    bingoCards: DS.hasMany('bingoCard', { async: true }),
    messages: DS.hasMany('message', { async: true }),
    winners: DS.hasMany('winner'),
    createdAt: DS.attr(),
    updatedAt: DS.attr()
});