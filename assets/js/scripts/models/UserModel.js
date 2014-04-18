App.User = DS.Model.extend({
    username: DS.attr(),
    clientSeed: DS.attr(),
    bingoCards: DS.hasMany('bingoCard'),
    winners: DS.hasMany('winner')
});