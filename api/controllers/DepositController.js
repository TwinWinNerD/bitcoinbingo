/**
 * DepositController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    callback: function (req, res) {
        var amount = req.param('value');
        var address = req.param('input_address');
        var hash = req.param('transaction_hash');
        var confirmations = req.param('confirmations');
        var confirmed = (confirmations > 0) ? 1 : 0;
        var secret = req.param('secret');

        if(amount < 0) {
            return res.ok('*ok*');
        }

        console.log(amount);
        console.log(address);
        console.log(hash);
        console.log(confirmations);
        console.log(confirmed);
        console.log(sails.config.blockchain.secret);

        if(secret !== sails.config.blockchain.secret) return res.badRequest('invalid secret');

        User.findOne().where({ depositAddress: address }).exec(function (err, user) {
            if(!err && user) {
                async.series([
                    function (done) {
                        Deposit.findOne().where({ hash: hash}).exec(function (err, deposit) {
                            if(!err && !deposit) {
                                Deposit.create({
                                    amount: amount,
                                    depositType: 'Bitcoin',
                                    hash: hash,
                                    confirmed: confirmed,
                                    user: user.id
                                }).exec(function (err, deposit) {

                                    if(!err && deposit) {

                                        UserService.updateBalance(user.id, 0).then(function (result) {
                                            Deposit.publishCreate(deposit.toJSON());

                                            if(confirmed > 0) {
                                                done(null, true);
                                            }

                                            done(true);
                                        });

                                    } else {
                                        done(true);
                                    }
                                });
                            } else if(deposit) {

                                if(confirmed > 0) {
                                    Deposit.update(deposit.id, { confirmed: confirmed }).exec(function (err, result) {
                                        if(!err && result) {

                                            Deposit.publishUpdate(deposit.id, { confirmed: confirmed }, null);
                                            done(null, true);
                                        } else {
                                            done(true);
                                        }
                                    });
                                } else {
                                    done(true);
                                }
                            }
                        });
                    },
                    function (done) {
                        Deposit.find().where({ user: user.id }).exec(function (err, deposits) {
                            if(!err && deposits.length <= 1 && amount < 1000000) {
                                Deposit.create({
                                    amount: amount,
                                    depositType: 'Promotion',
                                    confirmed: 1,
                                    user: user.id
                                }).exec(function (err, deposit) {
                                    if(!err && deposit) {

                                        UserService.updateBalance(user.id, 0).then(function (result) {
                                            Deposit.publishCreate(deposit.toJSON());

                                            done(null, true);

                                        });

                                    } else {
                                        done(true);
                                    }
                                });
                            } else {
                                done(true);
                            }
                        });
                    }
                ], function (err, result) {
                    if(!err && result) {
                        return res.ok('*ok*');
                    } else {
                        return res.badRequest();
                    }
                });
            } else {
                return res.badRequest();
            }
        });
    }
};
