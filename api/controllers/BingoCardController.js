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

    find: function (req, res) {

        var query;

        query = BingoCard.find()
            .where( actionUtil.parseCriteria(req) )
            .limit( actionUtil.parseLimit(req) )
            .skip( actionUtil.parseSkip(req) )
            .sort( actionUtil.parseSort(req) );

        query = actionUtil.populateEach(query, req.options);

        query.exec( function (err, result) {

            for(var i = 0; i < result.length; i++) {
                result[i].squares = BingoCardService.generateSquares(result[i].game.serverSeed, result[i].clientSeed, result[i].id)
            }

            if (req._sails.hooks.pubsub && req.isSocket) {
                BingoCard.subscribe(req, result);
                if (req.options.autoWatch) { BingoCard.watch(req); }
                // Also subscribe to instances of all associated models
                _.each(result, function (record) {
                    actionUtil.subscribeDeep(req, record);
                });
            }

            res.ok(result);
        });
    },

    create: function(req, res) {
        var Model = actionUtil.parseModel(req);

        // Create data object (monolithic combination of all parameters)
        // Omit the blacklisted params (like JSONP callback param, etc.)
        var data = actionUtil.parseValues(req);

        if(typeof req.user !== "undefined") {
            data.user = req.user.id;

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
                            withdrawal: function(done) {
                                Withdrawal.create({
                                    amount: results.totalPrize,
                                    user: data.user,
                                    withdrawalType: 'bingoCards'
                                }).exec(function (error, results) {
                                        if(!error) {
                                            done(null, results);
                                        } else {
                                            done(error);
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
                            console.log(error);
                            console.log(results);

                            if(!error) {
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
            res.json(500, { error: "Need to be logged in to buy cards" });
        }
    }
};
