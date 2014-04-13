App.Table = DS.Model.extend({
    createdAt: DS.attr(),
    updatedAt: DS.attr(),
    games: DS.hasMany('game')
});