App.Game = DS.Model.extend({
    serverSeed: DS.attr(),
    createdAt: DS.attr(),
    updatedAt: DS.attr(),
    gameStatus: DS.attr(),
    table: DS.belongsTo('table'),
    bingoCards: DS.hasMany('bingoCard')
});