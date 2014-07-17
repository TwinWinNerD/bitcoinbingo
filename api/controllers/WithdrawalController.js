/**
 * WithdrawalController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var actionUtil = require('../actionUtil');
var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(1, 10000, true);

var count = 0;
var withdrawalQueue = async.queue(function (task, callback) {
    limiter.removeTokens(1, function(err, remainingRequests) {
        if(remainingRequests < 0) {
            callback(true);
        }

        UserService.getBalance(task.userId, 1).then(function (result) {
            if(result) {
                callback(null, result);
            }
        });
    });
}, 1);

module.exports = {

    create: function (req, res) {
        var data = actionUtil.parseValues(req);

        withdrawalQueue.push({ userId: req.session.user.id }, function (err, result) {
            if(err) {
                return res.json({ error: "You are not allowed to make this request so soon. Please wait 10 seconds." });
            }
            var promotion = Number(result.promotion);
            var cardsBought = Number(result.cardsBought);

            data.amount -= 10000; // substract withdrawal fee

            // minimum deposit 10000 satoshi / 0.1mBTC
            if(data.amount < 10000) {
                return res.json({ error: "Your withdrawal amount is too low." });
            }

            if(cardsBought < promotion) {
                return res.json({ error:
                    "To withdraw your promotion you need to spent it at least once. " +
                    "You have only spent " + cardsBought / 100 + " Bits. " +
                        "The required amount is " + promotion / 100 + " Bits." });
            }

            var balance = Number((result.deposits + result.promotion) - result.withdrawals);

            if(balance < data.amount) {
                return res.json({ error: "You can't withdraw this much. Please remember: deposits need to be confirmed at least once." });
            }

            var userId = req.session.user.id;

            Withdrawal.create({ amount: data.amount, user: userId, withdrawalType: 'Bitcoin', recipientAddress: data.address}).exec(function (err, withdrawal) {
                if(!err && withdrawal) {
                    BlockchainService.sendTransaction(data.address, data.amount).then(function (transaction) {
                        console.log(result);

                        if(typeof transaction.error !== 'undefined') {
                            withdrawal.destroy(function (err) {
                                if(!err) {
                                    UserService.updateBalance(userId, 0).then(function (result) {
                                        return res.json({ error: "We are having some problems with the hot wallet. Please try again later." });
                                    });
                                }
                            })
                        } else {
                            UserService.updateBalance(userId).then(function (result) {

                                withdrawal.hash = transaction.tx_hash;

                                withdrawal.save(function (err) {
                                    StatisticsService.emitStatistics();
                                    Withdrawal.publishCreate(withdrawal);
                                });

                            });
                            return res.json(transaction);
                        }
                    });
                } else {
                    return res.json({ error: "We are having some problems creating a withdrawal for you. Please try again later." });
                }
            });
        });
    }
};
