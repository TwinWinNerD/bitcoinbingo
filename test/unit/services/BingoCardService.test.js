var chai = require('chai');

var should = chai.should();

describe('BingoCardService', function () {
  var user;
  var table;
  var game;
  var bingoCard;

  before(function (done) {
    async.auto([
      function (done) {
        User.create({
          username: "TestingBingoCardService",
          balance: 1000
        }).exec(function(err, result) {
          user = result;
          done();
        });
      },
      function (done) {
        Table.create({
          minimumPlayers: 2,
          maximumPlayers: 2,
          maximumCards: 1,
          cardPrice: 10,
          tableType: 'beginner'
        }).exec(function (err, result) {
          table = result;

          Game.create({
            serverSeed: 'serverSeed',
            status: 'idle',
            table: result.id
          }).exec(function (err, result) {
            game = result;
            done();
          });
        })
      }
    ], function (err, results) {
      done();
    });
  });

  describe('#findNextNonce()', function () {
    var params;
    it('should return 0 if no bingoCard belongs to this player', function (done) {
      params = {
        gameId: game.id
      };

      BingoCardService.findNextNonce(params)
        .then(function (result) {
          result.should.equal(0);
          done();
        });
    });

    it('should return 1 if a bingoCard with nonce 0 exists', function (done) {
      params = {
        gameId: game.id,
        userId: user.id
      };

      BingoCard.create({
        user: user.id,
        game: game.id,
        clientSeed: 'clientSeed',
        nonce: 0
      }).exec(function (err, result) {
        bingoCard = result;

        BingoCardService.findNextNonce(params)
          .then(function (result) {
            result.should.equal(1);

            BingoCard.destroy(bingoCard.id)
              .exec(function () {
                done();
              });
          });
      });
    });

    it('should return 2 if a bingoCard with nonce 1 exists', function (done) {
      params = {
        gameId: game.id,
        userId: user.id
      };

      BingoCard.create([{
        user: user.id,
        game: game.id,
        clientSeed: 'clientSeed',
        nonce: 0
      },{
        user: user.id,
        game: game.id,
        clientSeed: 'clientSeed',
        nonce: 1
      }]).exec(function (err, result) {
        bingoCard = result;

        BingoCardService.findNextNonce(params)
          .then(function (result) {
            result.should.equal(2);

            BingoCard.destroy(bingoCard.id)
              .exec(function () {
                done();
              });
          });
      });
    });
  });

  describe('#countCards()', function () {
    it('should correctly count the cards', function (done) {
      BingoCardService.countCards(game.id, user.id)
        .then(function (result) {
          result.should.equal(0);
          done();
        });
    });

    describe('after buying cards', function () {
      before(function (done) {
        BingoCard.create({
          user: user.id,
          game: game.id,
          clientSeed: 'clientSeed',
          nonce: 0
        }).exec(function (err, result) {
          bingoCard = result;
          done();
        });
      });

      it('should count 1 card now', function (done) {
        BingoCardService.countCards(game.id, user.id)
          .then(function (result) {
            result.should.equal(1);
            done();
          });
      });
    });
  });

  describe('#buyCards()', function () {
    before(function (done) {
      var cards = [];
      cards.push(bingoCard.id);

      BingoCardService.buyCards(game.id, user.id, cards)
        .then(function (result) {
          done();
        });
    });

    it('should now have 1 card that is bought', function (done) {
      BingoCard.findOne(bingoCard.id)
        .exec(function (err, result) {
          result.bought.should.equal(1);
          done();
        });
    })
  });

  describe('#isUserAllowedToBuyCards()', function () {
    it('should not allow the user to buy cards', function (done) {
      BingoCardService.isUserAllowedToBuyCards(game.id, user.id)
        .then(function (result) {
          result.should.equal(false);
          done();
        });
    });

    it('should allow the user to buy cards', function (done) {
      Table.update(table.id, { maximumCards: 2})
        .exec(function (err, result) {
          BingoCardService.isUserAllowedToBuyCards(game.id, user.id)
            .then(function (result) {
              result.should.equal(true);
              done();
            });
        });
    });

  });

  after(function (done) {
    async.auto([
      function (done) {
        User.destroy(user.id)
          .exec(function () {
            done();
          });
      },
      function (done) {
        Table.destroy(table.id)
          .exec(function () {
            done();
          });
      },
      function (done) {
        Game.destroy(game.id)
          .exec(function () {
            done();
          });
      },
      function (done) {
        BingoCard.destroy(bingoCard.id)
          .exec(function () {
            done();
          });
      }, function (done) {
        Withdrawal.destroy({ user: user.id})
          .exec(function () {
            done();
          })
      }
    ], function (err, result) {
      done();
    });

  });
});