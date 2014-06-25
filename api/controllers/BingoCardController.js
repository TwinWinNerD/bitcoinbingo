/**
 * BingoCardController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var actionUtil, async;

actionUtil = require('../actionUtil');
async = require('async');

module.exports = {

    create: function(req, res) {
        var Model = actionUtil.parseModel(req);

        // Create data object (monolithic combination of all parameters)
        // Omit the blacklisted params (like JSONP callback param, etc.)
        var data = actionUtil.parseValues(req);

        if(typeof req.session.user !== "undefined" && req.session.user !== null) {
            data.user = req.session.user.id;

            BingoCardService.isUserAllowedToBuyCards(data.game, data.user).then(function (resolve) {
                if(resolve) {
                    async.parallel({
                        totalPrize: function(done) {
                            // use amountOfCards = 1 for now
                            BingoCardService.calculateTotalPrice(data.game, 1).then( function (totalPrize) {
                                if(totalPrize !== null) {
                                    done(null, totalPrize);
                                }
                            }, function (error) {
                                if(error) {
                                    done(error);
                                }
                            });
                        },
                        userBalance: function(done) {
                            UserService.getBalance(data.user).then(function (balance) {
                                if(balance !== null) {
                                    done(null, balance);
                                }
                            }, function(error) {
                                if(error) {
                                    done(error);
                                }
                            });
                        }
                    }, function (error, results) {

                        if(!error) {

                            if(results.userBalance >= results.totalPrize) {

                                async.parallel({
                                    updateBalance: function(done) {
                                        var newBalance = results.userBalance - results.totalPrize;

                                        req.session.user.balance = newBalance;

                                        User.update(data.user, {
                                            balance: newBalance
                                        }).exec(function (error, results) {
                                            if(!error) {
                                                User.publishUpdate(data.user, { balance: newBalance }, null);

                                                done(null, results);
                                            } else {
                                                done(error);
                                            }
                                        });
                                    },
                                    withdrawal: function(done) {
                                        Withdrawal.create({
                                            amount: results.totalPrize,
                                            user: data.user,
                                            withdrawalType: 'bingoCards'
                                        }).exec(function (error, results) {
                                                if(!error) {
                                                    Withdrawal.publishCreate(results);

                                                    done(null, results);
                                                } else {
                                                    done(error);
                                                }
                                            });
                                    },
                                    addedToGame: function(done) {

                                        Game.findOne(data.game).exec(function(err, result) {
                                            if(err) {
                                                done(err);
                                            } else {
                                                var foundUser = false;
                                                for(var i = 0; i < result.users.length; i++) {
                                                    if(result.users[i].id === data.user) {
                                                        foundUser = true;
                                                    }
                                                }

                                                if(foundUser) {
                                                    done(null);
                                                } else {
                                                    result.users.add(data.user);
                                                    result.save(function (error, result) {
                                                        if(!err) {
                                                            var user = {
                                                                id: data.user,
                                                                username: req.session.user.username,
                                                                balance: req.session.user.balance,
                                                                games: [data.game]
                                                            };

                                                            Game.publishAdd(data.game, "users", user);
                                                        }
                                                    });

                                                    done(null);
                                                }

                                            }
                                        });
                                    },
                                    cards: function(done) {
                                        // Create new instance of model using data from params
                                        BingoCard.create(data).exec(function created (err, newInstance) {

                                            // Differentiate between waterline-originated validation errors
                                            // and serious underlying issues. Respond with badRequest if a
                                            // validation error is encountered, w/ validation info.
                                            if (err) return res.negotiate(err);

                                            // If we have the pubsub hook, use the model class's publish method
                                            // to notify all subscribers about the created item
                                            if (req._sails.hooks.pubsub) {
                                                if (req.isSocket) {
                                                    Model.subscribe(req, newInstance);
                                                    Model.introduce(newInstance);
                                                }

                                                Model.publishCreate(newInstance, !req.options.mirror && req);
                                            }


                                            done(null, newInstance);


                                        });
                                    }
                                }, function(error, results) {

                                    if(!error) {

                                        BingoService.minimumPlayersReached(data.game).then( function (result) {

                                            if(result) {
                                                Game.findOne(data.game).exec(function (err, result) {
                                                    if(result.gameStatus === 'idle') {
                                                        BingoService.settleRound(data.game, false);
                                                    }
                                                })
                                            } else {
                                                // nope not yet
                                            }

                                        });

                                        res.status(201);
                                        res.ok(results.cards.toJSON());
                                    }

                                });
                            }  else {

                                res.json(500, { error: "Not enough balance" });
                            }
                        }
                    });
                } else {

                    res.json(500, { error: "You have exceeded the maximum amount of cards for this game"});
                }
            }, function (error) {

                res.json(500, { error: error });
            });

        } else {
            res.json(500, { error: "Need to be logged in to buy cards" });
        }
    }
};
