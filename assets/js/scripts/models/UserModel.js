App.User = DS.Model.extend({
    username: DS.attr(),
    clientSeed: DS.attr(),
    bingoCards: DS.hasMany('bingoCard'),
    deposits: DS.hasMany('deposit'),
    withdrawals: DS.hasMany('withdrawal'),
    winners: DS.hasMany('winner')
});