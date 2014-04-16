App.User = DS.Model.extend({
    username: DS.attr(),
    email: DS.attr(),
    bingoCards: DS.hasMany('bingoCard'),
    winners: DS.hasMany('winner')
});