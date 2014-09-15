var chai = chai || require('chai');

var should = chai.should();

describe('WithdrawalService', function () {
  var user;
  var withdrawal;

  before(function (done) {
    User.create({
      username: "TestingWithdrawalService",
      balance: 100
    }).exec(function(err, result) {
      user = result;
      done();
    });
  });

  describe('#createWithdrawal()', function () {
    before(function (done) {
      WithdrawalService.createWithdrawal(user.id, 100, 'card')
        .then(function (result) {
          withdrawal = result;
          done();
        });
    });

    it('should have created a withdrawal', function (done) {
      Withdrawal.count({ user: user.id })
        .exec(function (err, result) {
          result.should.equal(1);
          done();
        })
    });

    it('should have set the user balance to 0', function (done) {
      User.findOne(user.id)
        .exec(function (err, result) {
          result.balance.should.equal(0);
          done();
        });
    });
  });

  after(function (done) {
    async.auto([
      function (done) {
        User.destroy(user.id)
          .exec(function() {
            done();
          });
      },
      function (done) {
        Withdrawal.destroy(withdrawal.id)
          .exec(function () {
            done();
          });
      }
    ], function () {
      done();
    });
  });
});