var Q = require('q');

exports.createGame = function (tableId) {
  var deferred = Q.defer();

  Game.create({
    table: tableId,
    status: 'idle',
    serverSeed: SeedService.generateServerSeed(),
    pattern: PatternService.getRandomPattern()
  }).exec(function (err, result) {
    if (!err && result) {
      Game.publishCreate(result);

      deferred.resolve(result);
    } else {
      deferred.reject(err);
    }
  });

  return deferred.promise;
};

exports.addPrizePool = function (gameId, amount) {
  var deferred = Q.defer();

  var query = 'UPDATE `game` SET `game`.`prizePool`=`game`.`prizePool` + ' +
    amount + ' WHERE id=' + gameId;

  Game.query(query, function (err, result) {
    if(!err && result) {
      Game.findOne(gameId)
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

exports.removePrizePool = function (gameId, amount) {
  var deferred = Q.defer();

  var query = 'UPDATE `game` SET `game`.`prizePool`=`game`.`prizePool` - ' +
    amount + ' WHERE id=' + gameId;

  Game.query(query, function (err, result) {
    if(!err && result) {
      Game.findOne(gameId)
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