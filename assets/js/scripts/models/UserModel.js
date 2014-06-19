App.User = DS.Model.extend({
    username: DS.attr(),
    balance: DS.attr(),
    clientSeed: DS.attr(),
    email: DS.attr(),
    password: DS.attr(),
    bingoCards: DS.hasMany('bingoCard'),
    deposits: DS.hasMany('deposit'),
    withdrawals: DS.hasMany('withdrawal'),
    winners: DS.hasMany('winner'),
    games: DS.hasMany('game')
});