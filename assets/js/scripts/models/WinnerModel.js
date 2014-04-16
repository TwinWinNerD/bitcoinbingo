App.Winner = DS.Model.extend({
    user: DS.belongsTo('user'),
    game: DS.belongsTo('game')
});