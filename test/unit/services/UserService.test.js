var chai = chai || require('chai');

var should = chai.should();

describe.only('UserService', function() {
  var user;

  before(function (done) {
    User.create({
      username: "TestingUserService",
      balance: 100
    }).exec(function(err, result) {
      user = result;
      done();
    });
  });

  describe('#getBalance()', function() {
    it('should return the correct balance', function (done) {
      UserService.getBalance(user.id)
        .then(function (balance) {
          balance.should.equal(100);
          done();
        });
    });
  });

  describe('#addBalance()', function () {
    it('should correctly add balance', function (done) {
      UserService.addBalance(user.id, 100)
        .then(function (balance) {
          balance.should.equal(200);
          done();
        })
    });
  });

  describe('#substractBalance()', function () {
    it('should correctly substract balance', function (done) {
      UserService.substractBalance(user.id, 100)
        .then(function (balance) {
          balance.should.equal(100);
          done();
        })
    });

    it('should prevent substracting too much balance', function (done) {
      UserService.substractBalance(user.id, 200)
        .then(function (balance) {
          balance.should.equal(undefined);
        }, function (err) {
          err.should.be.ok;
          done();
        });
    });
  });

  after(function (done) {
    User.destroy(user.id)
      .exec(function(err) {
        done();
      });
  });
});