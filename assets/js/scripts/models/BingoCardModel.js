App.BingoCard = DS.Model.extend({
    clientSeed: DS.attr(),
    squares: DS.attr(),
    game: DS.belongsTo('game'),
    user: DS.belongsTo('user')
});