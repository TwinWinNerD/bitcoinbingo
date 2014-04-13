App.BingoCard = DS.Model.extend({
    clientSeed: DS.attr(),
    game: DS.belongsTo('game'),
    user: DS.belongsTo('user')
});