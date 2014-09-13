var Q = require('q');
var async = require('async');

exports.getBalance = function (userId) {
  var deferred = Q.defer();

  User.findOne(userId)
    .exec(function (err, result) {
      if(err && !result) {
        deferred.reject(err);
      } else {
       deferred.resolve(result.balance);
      }
    });

  return deferred.promise;
};

exports.calculateBalance = function (userId, confirmed) {
  var deferred = Q.defer();

  if (!confirmed) confirmed = 0;

  async.parallel({
    deposits: function (done) {
      Deposit.find().where({user: userId})
        .where({ confirmed: { '>=': confirmed }})
        .where({ depositType: { '!': 'Promotion' } })
        .sum('amount').exec(function (error, sum) {
          if (!error) {
            if (sum.length > 0) {
              done(null, sum[0].amount);
            } else {
              done(null, 0);
            }
          } else {
            done(error);
          }
        });
    },
    promotion: function (done) {
      Deposit.find().where({user: userId, depositType: 'Promotion' }).sum('amount').exec(function (error, sum) {
        if (!error) {
          if (sum.length > 0) {
            done(null, sum[0].amount);
          } else {
            done(null, 0);
          }
        } else {
          done(error);
        }
      });
    },
    withdrawals: function (done) {
      Withdrawal.find().where({user: userId }).sum('amount').exec(function (error, sum) {
        if (!error) {
          if (sum.length > 0) {
            done(null, sum[0].amount);
          } else {
            done(null, 0);
          }
        } else {
          done(error);
        }
      });
    },
    cardsBought: function (done) {
      Withdrawal.find().where({user: userId, withdrawalType: 'Card' }).sum('amount').exec(function (error, sum) {
        if (!error) {
          if (sum.length > 0) {
            done(null, sum[0].amount);
          } else {
            done(null, 0);
          }
        } else {
          done(error);
        }
      });
    }
  }, function (error, results) {
    if (!error) {
      deferred.resolve(results);
    } else {
      deferred.reject("Error while determining balance");
    }
  });

  return deferred.promise;
};

exports.addBalance = function (userId, amount) {
  var deferred = Q.defer();

  var query = 'UPDATE `user` SET `balance`=`balance`+' + amount + ' WHERE id=' + userId;

  User.query(query, function (err, result) {
    if (!err && result) {
      exports.getBalance(userId).then(function (balance) {
        User.publishUpdate(userId, { balance: balance }, null);

        deferred.resolve(balance);
      });
    } else {
      deferred.reject(err);
    }
  });

  return deferred.promise;
};

exports.substractBalance = function (userId, amount) {
  var deferred = Q.defer();

  var query = 'UPDATE `user` SET `balance`=`balance`-' + amount + ' WHERE id=' + userId;

  User.query(query, function (err, result) {
    if (!err && result) {
      exports.getBalance(userId).then(function (balance) {
        User.publishUpdate(userId, { balance: balance }, null);

        deferred.resolve(balance);
      });
    } else {
      deferred.reject(err);
    }
  });

  return deferred.promise;
};