var Q, async;

Q = require('q');
async= require('async');

exports.getBalance = function (userId, confirmed) {
    var deferred = Q.defer();

    if(!confirmed) confirmed = 0;

    async.parallel({
        deposits: function (done) {
            Deposit.find().where( {user: userId, confirmed: { '>=': confirmed } }).sum('amount').exec(function (error, sum) {
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
        }
    }, function (error, results) {
        if (!error) {
            deferred.resolve(results.deposits - results.withdrawals);
        } else {
            deferred.reject("Error while determining balance");
        }
    });

    return deferred.promise;
};

exports.updateBalance = function (userId, amount) {
    var deferred = Q.defer();

    exports.getBalance(userId, 0).then(function (balance) {
        balance = Number(balance);
        amount = Number(amount);

        console.log(balance);
        console.log(amount);

        if(amount < 0) {
            balance -= amount;
        } else {
            balance += amount;
        }
        console.log(balance);

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