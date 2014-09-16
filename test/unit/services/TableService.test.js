var chai = require('chai');

var should = chai.should();

describe('TableService', function () {
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
      done();
    });
  });

  describe('#addJackpot()', function () {
    it('should correctly update the jackpot balance', function (done) {
      TableService.addJackpot(table.id, 100)
        .then(function (result) {
          result.jackpot.should.equal(100);
          TableService.addJackpot(table.id, 100)
            .then(function (result) {
              result.jackpot.should.equal(200);
              done();
            });
        });
    });
  });

  describe('#calculateJackpot()', function () {
    it('should correctly calculate the jackpot amount', function () {
      var jackpotAmount = TableService.calculateJackpot(1000);
      jackpotAmount.should.equal(5);

      jackpotAmount = TableService.calculateJackpot(2000);
      jackpotAmount.should.equal(10);
    });
  });

  after(function (done) {
    async.auto([
      function (done) {
        Table.destroy(table.id)
          .exec(function() {
            done();
          });
      }
    ], function () {
      done();
    });
  });
});