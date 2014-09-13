/**
 * BingoCardController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var actionUtil = require('../actionUtil');

var startGameQueue = async.queue(function (task, callback) {
  BingoService.startGame(task.gameId).then(function () {
    callback();
  });
}, 1);

module.exports = {
  create: function (req, res) {
    var data = actionUtil.parseValues(req);

    data.user = req.session.user.id;

    BingoCardService.isUserAllowedToBuyCards(data.game, data.user)
      .then(function (allowed) {
        if (allowed) {
          Game.findOne(data.game)
            .populate('table')
            .exec(function (err, game) {
              if (err && !game) {
                return res.json({ error: err });
              }

              UserService.getBalance(data.user).then(function (balance) {
                var cardPrice = game.table.cardPrice;

                if (balance < cardPrice) {
                  return res.json({ error: "Not enough balance" });
                }

                async.series([
                  function (done) {
                    Withdrawal.create({
                      amount: cardPrice,
                      user: data.user,
                      withdrawalType: 'Card'
                    }).exec(function (error, withdrawal) {
                      if (!error) {
                        UserService.getBalance(data.user).then(function (result) {
                          Withdrawal.publishCreate(withdrawal);
                          done(null, withdrawal);
                        });
                      } else {
                        done(error);
                      }
                    });
                  },
                  function (done) {
                    UserService.substractBalance(data.user, cardPrice).then(function (result) {
                      done(null, result);
                    }, function (error) {
                      done(error);
                    });
                  },
                  function (done) {

                    Game.findOne(data.game).exec(function (err, result) {
                      if (err) {
                        done(err);
                      } else {
                        var foundUser = false;
                        for (var i = 0; i < result.users.length; i++) {
                          if (result.users[i].id === data.user) {
                            foundUser = true;
                          }
                        }

                        if (foundUser) {
                          done(null);
                        } else {
                          result.users.add(data.user);
                          result.save(function (err, result) {
                            if (!err && result) {
                              var user = {
                                id: data.user,
                                username: req.session.user.username,
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
                  function (done) {
                    BingoCard.create(data).exec(function created (err, card) {

                      if (req._sails.hooks.pubsub) {
                        if (req.isSocket) {
                          BingoCard.subscribe(req, card);
                          BingoCard.introduce(card);
                        }

                        BingoCard.publishCreate(card, !req.options.mirror && req);
                      }

                      done(null, card);
                    });
                  }
                ], function (error, results) {
                  req.session.user.isBusy = false;

                  if (!error) {
                    startGameQueue.push({gameId: data.game});
                    StatisticsService.emitStatistics();
                    res.status(201);
                    res.ok(results[3].toJSON());
                  }
                });
              }, function (error) {
                return res.json({ error: error });
              });
          });
        } else {
          res.json({ error: "You are not allowed to buy cards at the moment." });
        }
    }, function (error) {
      res.json({ error: error });
    });
  }
};
