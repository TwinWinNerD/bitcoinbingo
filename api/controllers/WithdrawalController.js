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
                return res.json({ error: "You are not allowed to make this request so soon." });
            }
            var promotion = Number(result.promotion);
            var cardsBought = Number(result.cardsBought);

            if(cardsBought < promotion) {
                return res.json({ error: "To withdraw your promotion you need to spent it at least once." });
            }

            var balance = Number((result.deposits + result.promotion) - result.withdrawals);

            if(balance < data.amount) {
                return res.json({ error: "You can't withdraw this much. Please remember: deposits need to be confirmed at least once." });
            }

            BlockchainService.sendTransaction(data.address, data.amount).then(function (result) {
                console.log(result);

                if(typeof result.error !== 'undefined') {
                    return res.json({ error: "We are having some problems with the hot wallet. Please try again later." });
                }

                Withdrawal.create({ amount: data.amount, user: req.session.user.id, withdrawalType: 'Bitcoin', recipientAddress: data.address, hash: result.tx_hash}).exec(function (err, withdrawal) {
                    console.log("inside withdrawal");
                    console.log(err);
                    console.log(withdrawal);

                    if(!err) {
                        UserService.updateBalance(data.user).then(function (result) {
                            Withdrawal.publishCreate(withdrawal);
                        });
                    }
                    return res.json(result);

                });

            });
        });
    }
};
