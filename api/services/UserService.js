var Q, async;

Q = require('q');
async= require('async');

exports.getBalance = function (userId) {
    var deferred;

    deferred = Q.defer();

    async.parallel({
        deposits: function (done) {
            Deposit.find().where( {user: userId }).sum('amount').exec(function (error, sum) {
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