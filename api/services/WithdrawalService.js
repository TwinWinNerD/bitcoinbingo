var Q = require('q');

exports.createWithdrawal = function (userId, amount, type) {
  var deferred = Q.defer();

  Withdrawal.create({
    amount: amount,
    user: userId,
    withdrawalType: type
  }).exec(function (err, result) {
    if(!err && result) {
      Withdrawal.publishCreate(result);

      UserService.substractBalance(userId, amount).then(function () {
        deferred.resolve(result);
      }, function (err) {
        deferred.reject(err);
      });
    } else {
      deferred.reject(err);
    }
  });

  return deferred.promise;
};