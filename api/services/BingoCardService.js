var crypto = require('crypto');
var Q = require('q');
var async = require('async');

exports.generateCards = function (params) {
  var deferred = Q.defer();

  if(!params.gameId) deferred.reject("`gameId` required");
  if(!params.userId) deferred.reject("`userId` required");
  if(!params.clientSeed) deferred.reject("`clientSeed` required");
  if(!params.amount) params.amount = 20;

  exports.findNextNonce(params)
    .then(function (result) {
      exports.removeCurrentCards(params)
        .then(function () {
          var nonce = result;
          var amount = params.amount;
          var cards = [];

          for(var i = 0; i < amount; i++) {
            var card = {
              clientSeed: params.clientSeed,
              nonce: nonce,
              user: params.userId,
              game: params.gameId
            };
            cards.push(card);
            nonce++;
          }

          BingoCard.create(cards)
            .exec(function (err, result) {
              if(!err && result) {
                deferred.resolve(result);
              } else {
                deferred.reject(err);
              }
            });
        }, function (err) {
          deferred.reject(err);
        });
    }, function (err) {
      deferred.reject(err);
    });

  return deferred.promise;
};

exports.findNextNonce = function (params) {
  var deferred = Q.defer();

  if(!params.gameId) deferred.reject("`gameId` required");
  if(!params.userId) deferred.reject("`userId` required");

  BingoCard.findOne({ user: params.userId, game: params.gameId })
    .sort('nonce DESC')
    .exec(function (err, result) {
      if(err) {
        deferred.reject(err);
      } else if(!result) {
        deferred.resolve(0);
      } else {
        deferred.resolve(result.nonce + 1);
      }
    });

  return deferred.promise;
};

exports.removeCurrentCards = function (params) {
  var deferred = Q.defer();

  if(!params.gameId) deferred.reject("`gameId` required");
  if(!params.userId) deferred.reject("`userId` required");

  BingoCard.destroy({ user: params.userId, game: params.gameId })
    .exec(function (err) {
      if(!err) {
        deferred.resolve(true);
      } else {
        deferred.reject(err);
      }
    });

  return deferred.promise;
};

exports.buyCards = function (gameId, userId, cards) {
  var deferred = Q.defer();

  var amount = cards.length;

  Game.findOne(gameId)
    .populate('table')
    .exec(function (err, result) {
      if(!err && result) {
        var withdrawalAmount = amount * result.table.cardPrice;

        WithdrawalService.createWithdrawal(userId, withdrawalAmount, 'buy cards')
          .then(function () {
            var query = 'UPDATE `bingocard` SET bought=1 WHERE `id` IN ('
              + cards + ') AND bought=0 AND user=' + userId;

            BingoCard.query(query, function (err, result) {
                if(!err && result) {
                  BingoCard.find()
                    .where({ user: userId, game: gameId, bought: 1})
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
          }, function () {
            deferred.reject("Couldn't buy cards");
          });
      } else {
        deferred.reject("Couldn't find the game");
      }
    });

  return deferred.promise;
};

exports.calculateTotalPrice = function (gameId, amountOfCards) {
  var deferred = Q.defer();

  Game.findOne(gameId).populate('table').exec(function (error, result) {
    if (error) {
      deferred.reject(error);
    } else {
      var totalPrice = result.table.cardPrice * amountOfCards;
      deferred.resolve(totalPrice);
    }
  });

  return deferred.promise;
};

exports.isUserAllowedToBuyCards = function (gameId, userId) {
  var deferred = Q.defer();

  Game.findOne({ id: gameId })
    .populate('table')
    .exec(function (error, result) {
      if (error) {
        deferred.reject(error);
      } else if (result.status !== "idle" && result.status !== "countDown") {
        deferred.reject("Game is already started or finished");
      } else {
        deferred.resolve(true);
      }
    });

  return deferred.promise;
};

exports.countCards = function (gameId, userId) {
  var deferred = Q.defer();

  BingoCard.count({ where: {
    game: gameId,
    user: userId
  }}).exec(function (err, result) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(result);
    }
  });

  return deferred.promise;
};

exports.generateSquares = function (serverSeed, clientSeed, nonce) {
  var squares, hash, squareIndex, characterIndex, subsitute, decimal, hashCharacters;

  squares = [
    [],
    [],
    [],
    [],
    []
  ];

  hash = exports.generateCardHash(serverSeed, clientSeed, nonce);
  hashCharacters = hash.split('');

  squareIndex = 0;
  characterIndex = 0;
  subsitute = 0;

  while (squareIndex < squares.length) {

    while (characterIndex < hashCharacters.length) {

      decimal = parseInt(hashCharacters[characterIndex], 16);

      if (squares[squareIndex]) {

        if (decimal !== 0 && squares[squareIndex].length < 5 && squares[squareIndex].indexOf(decimal + subsitute) === -1) {

          if (squareIndex === 2 && squares[2].length === 2) {
            squares[squareIndex].push(0);
          } else {
            decimal += subsitute;
            squares[squareIndex].push(decimal);
          }

        } else if (squares[squareIndex].length === 5) {
          subsitute += 15;
          squareIndex++;
        }
      }

      characterIndex++;
    }
  }

  return squares;
};

exports.generateCardHash = function (serverSeed, clientSeed, nonce) {
  return crypto.createHash('sha512').update(serverSeed + ":" + clientSeed + ":" + nonce).digest('hex');
};