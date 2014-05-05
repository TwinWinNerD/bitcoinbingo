App.Message = DS.Model.extend({
    user: DS.attr(),
    body: DS.attr(),
    game: DS.belongsTo('game')
});