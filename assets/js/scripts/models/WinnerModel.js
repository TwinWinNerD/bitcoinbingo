App.Winner = DS.Model.extend({
	winnerType: DS.attr(),
	amount: DS.attr(),
	bingoCard: DS.belongsTo('bingoCard'),
    user: DS.belongsTo('user'),
    game: DS.belongsTo('game')
});