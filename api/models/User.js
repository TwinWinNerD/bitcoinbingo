var bcrypt = require('bcrypt');

module.exports = {
  attributes: {
    username: {
      type: 'STRING',
      unique: true,
      minLength: 3,
      required: true
    },
    email: {
      type: 'STRING',
      email: true,
      unique: true,
      required: false
    },
    password: {
      type: 'STRING'
    },
    clientSeed: {
      type: 'STRING',
      required: false,
      maxLength: 20,
      defaultsTo: ""
    },
    depositAddress: {
      type: 'STRING',
      defaultsTo: ""
    },
    balance: {
      type: 'INTEGER',
      defaultsTo: 0
    },
    registrationIp: {
      type: 'STRING'
    },
    bingoCards: {
      collection: 'bingoCard',
      via: 'user'
    },
    deposits: {
      collection: 'deposit',
      via: 'user'
    },
    withdrawals: {
      collection: 'withdrawal',
      via: 'user'
    },
    winners: {
      collection: 'winner',
      via: 'user'
    },
    games: {
      collection: 'game',
      via: 'users'
    },
    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },
  protectedAttributes: function () {
    return [ "username", "balance", "bingoCards", "games", "winners", "deposits", "withdrawals", "depositAddress" ];
  },
  beforeCreate: function (user, next) {
    if (user.hasOwnProperty('password')) {
      bcrypt.hash(user.password, 10, function (err, hash) {
        user.password = hash;
        next(err, user);
      });
    } else {
      next(null, user);
    }
  },
  beforeUpdate: function (user, next) {
    if (user.hasOwnProperty('password')) {
      bcrypt.hash(user.password, 10, function (err, hash) {
        user.password = hash;
        next(err, user);
      });
    } else {
      next(null, user);
    }
  }
};