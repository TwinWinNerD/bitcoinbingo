var assert = require('better-assert');

module.exports = {

  buyCards: function (req, res) {
    assert(req.param('cards'));
    assert(req.param('gameId'));

    var cards = req.param('cards');
    var gameId = req.param('gameId');
    var userId = req.session.user.id;

    BingoCardService.isUserAllowedToBuyCards(gameId, userId)
      .then(function (allowed) {
        if(allowed) {
          BingoCardService.buyCards(gameId, userId, cards)
            .then(function (result) {
              var boughtCards = result;
              Game.findOne(gameId)
                .populate('table')
                .exec(function (err, result) {
                  if(!err && result) {
                    var cardPrice = result.table.cardPrice;
                    var amount = cards.length * cardPrice;
                    var houseEdge = result.table.houseEdge;

                    var tableJackpot = TableService.calculateJackpot(amount);
                    var prizePool = GameService.calculatePrizePool(amount, houseEdge);

                    async.auto({
                      jackpot: function (done) {
                        TableService.addJackpot(result.table.id, tableJackpot)
                          .then(function (result) {
                            done(null, result);
                          }, done);
                      },
                      prizePool: function (done) {
                        GameService.addPrizePool(gameId, prizePool)
                          .then(function (result) {
                            done(null, result);
                          }, done);
                      },
                      addUser: function (done) {
                        GameService.addUser(gameId, userId)
                          .then(function (result) {
                            done(null, result);
                          }, done);
                      }
                    }, function (err, result) {
                      if(!err && result) {
                        res.ok(boughtCards);
                      } else {
                        return res.badRequest();
                      }
                    })
                  } else {
                    return res.badRequest();
                  }
                });
            }, function (err) {
              return res.badRequest();
            });
        } else {
          return res.badRequest();
        }
      }, function (err) {
        return res.json({ error: err });
      });
  }
};
