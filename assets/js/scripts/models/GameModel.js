App.Game = DS.Model.extend({
    serverSeed: DS.attr(),
    numbers: DS.attr(),
    drawnNumbers: DS.attr(),
    pattern: DS.attr(),
    gameStatus: DS.attr(),
    countDown: DS.attr(),
    table: DS.belongsTo('table'),
    bingoCards: DS.hasMany('bingoCard'),
    messages: DS.hasMany('message'),
    winners: DS.hasMany('winner'),
    users: DS.hasMany('user'),
    createdAt: DS.attr(),
    updatedAt: DS.attr()
});