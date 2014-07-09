var Q, async;

Q = require('q');
async= require('async');

exports.getBalance = function (userId, confirmed) {
    var deferred = Q.defer();

    if(!confirmed) confirmed = 0;

    async.parallel({
        deposits: function (done) {
            Deposit.find().where({user: userId})
                .where({ confirmed: { '>=': confirmed }})
                .where({ depositType: { '!': 'Promotion' } })
                .sum('amount').exec(function (error, sum) {
                if(!error) {
                    if(sum.length > 0) {
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
            Deposit.find().where( {user: userId, depositType: 'Promotion' }).sum('amount').exec(function (error, sum) {
                if(!error) {
                    if(sum.length > 0) {
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
            Withdrawal.find().where( {user: userId }).sum('amount').exec(function (error, sum) {
                if(!error) {
                    if(sum.length > 0) {
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
            Withdrawal.find().where( {user: userId, withdrawalType: 'Card' }).sum('amount').exec(function (error, sum) {
                if(!error) {
                    if(sum.length > 0) {
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

exports.updateBalance = function (userId, amount) {
    var deferred = Q.defer();

    if(!amount) amount = 0;

    exports.getBalance(userId, 0).then(function (result) {
        var balance = Number((result.deposits + result.promotion) - result.withdrawals);
        amount = Number(amount);

        if(amount < 0) {
            balance -= amount;
        } else {
            balance += amount;
        }

        User.update(userId, { balance: balance }).exec(function (err, result) {
            if(!err && result) {
                User.publishUpdate(userId, { balance: balance }, null);

                deferred.resolve(result);
            } else {
                deferred.reject(err);
            }
        });
    });

    return deferred.promise;
};