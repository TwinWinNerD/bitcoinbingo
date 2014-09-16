var Q = require('q');

exports.jackpotPercentage = 0.5;

exports.calculateJackpot = function (amount) {
  return (amount / 100) * exports.jackpotPercentage;
};

exports.addJackpot = function (tableId, amount) {
  var deferred = Q.defer();

  var query = 'UPDATE `table` SET `table`.`jackpot`=`table`.`jackpot` + ' +
    amount + ' WHERE id=' + tableId;

  Table.query(query, function (err, result) {
    if(!err && result) {
      Table.findOne(tableId)
        .exec(function (err, result) {
          if(!err && result) {
            deferred.resolve(result);
          } else {
            deferred.reject(err);
          }
        });
    } else {
      deferred.reject(err);
    }
  });

  return deferred.promise;
};