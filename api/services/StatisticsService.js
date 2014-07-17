var Q = require('q');

exports.getStatistics = function () {
    var deferred = Q.defer();

    async.series({
        users: function (done) {
            User.count().exec(function (err, result) {
                if(!err && result) {
                    done(null, result);
                } else {
                    done(err);
                }
            });
        },
        cardsBought: function (done) {
            BingoCard.count().exec(function (err, result) {
                if(!err && result) {
                    done(null, result);
                } else {
                    done(err);
                }
            });
        },
        wagered: function (done) {
            BingoCard.query('SELECT sum(cardPrice) as wagered FROM `bingocard` JOIN `game` ON `bingocard`.`game` = `game`.`id` JOIN `table` ON `game`.`table` = `table`.`id`', function (err, result) {
                if (!err && result) {
                    done(null, result[0].wagered);
                } else {
                    done(err);
                }
            });
        },
        payout: function (done) {
            Withdrawal.query('SELECT sum(amount) as payout FROM `withdrawal` WHERE `withdrawal`.`withdrawalType`="Bitcoin"', function (err, result) {
                if (!err && result) {
                    var payout = result[0].payout || 0;
                    done(null, payout);
                } else {
                    done(err);
                }
            });
        },
        promotion: function (done) {
            Withdrawal.query('SELECT sum(amount) as promotion FROM `deposit` WHERE `deposit`.`depositType`="Promotion"', function (err, result) {
                if (!err && result) {
                    var promotion = result[0].promotion || 0;
                    done(null, promotion);
                } else {
                    done(err);
                }
            });
        }
    }, function (err, result) {
        if(!err) {
            deferred.resolve(result);
        }
        deferred.reject(result);
    });

    return deferred.promise;
};

exports.emitStatistics = function () {
    exports.getStatistics().then(function (result) {
        sails.io.sockets.emit('statistics', result);
    });
};