var chai = require('chai');

var should = chai.should();

describe('GameService', function () {
  var game;
  var table;

  before(function (done) {
    Table.create({
      minimumPlayers: 1,
      maximumPlayers: 1,
      maximumCards: 1,
      cardPrice: 100,
      tableType: 'test'
    }).exec(function (err, result) {
      table = result;

      GameService.createGame(table.id)
        .then(function (result) {
          game = result;
          done();
        });
    });
  });

  describe('#createGame()', function () {
    it('should succesfully create a game', function () {
      game.id.should.not.equal(null);
      game.table.should.equal(table.id);
    });
  });

  describe('#addPrizePool', function () {
    it('should have a prizePool of 0', function () {
      game.prizePool.should.equal(0);
    });

    it('should update prizePool to 100', function (done) {
      GameService.addPrizePool(game.id, 100)
        .then(function (result) {
          result.prizePool.should.equal(100);
          done();
        });
    });

    it('should update prizePool to 200', function (done) {
      GameService.addPrizePool(game.id, 100)
        .then(function (result) {
          result.prizePool.should.equal(200);
          done();
        });
    });
  });

  after(function (done) {
    async.auto([
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
      }
    ], function () {
      done();
    });
  });
});