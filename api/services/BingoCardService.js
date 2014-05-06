var crypto, Q, async;

crypto = require('crypto');
Q = require('q');
async = require('async');

exports.calculateTotalPrice = function (gameId, amountOfCards) {

    var deferred;

    deferred = Q.defer();

    Game.findOne(gameId).populate('table').exec( function (error, result) {
        if(error) {
            deferred.reject(error);
        } else {
            var totalPrice = result.table.cardPrice * amountOfCards;
            deferred.resolve(totalPrice);
        }
    });

    return deferred.promise;
};

exports.isUserAllowedToBuyCards = function (game, user) {

    var deferred;

    deferred = Q.defer();

    Game.findOne({ id: game}).populate('table').exec( function (error, result) {
        if(error) {

            deferred.reject(error);
        } else if(result.gameStatus !== "idle" && result.gameStatus !== "countDown") {

            deferred.reject("Game is already started or finished");

        } else {

            async.parallel({
                amountOfCards: function (done) {
                    BingoCardService.countCards({
                        game: game,
                        user: user
                    }).then(function (amount) {
                            done(null, amount);
                        });
                },
                maximumCards: function (done) {
                    Game.findOne({ id: game}).populate('table').exec( function (error, result) {
                        if(error) {
                            done(error);
                        } else {
                            console.log(result.table);
                            done(null, result.table.maximumCards);
                        }
                    });
                }
            }, function (error, result) {
                if(!error) {
                    if(result.amountOfCards >= result.maximumCards) {
                        deferred.resolve(false);
                    } else {
                        deferred.resolve(true);
                    }
                }
            });

        }
    });



    return deferred.promise;
};


exports.countCards = function (whereStatement) {

    var queryObject, deferred;

    queryObject = new QueryService(whereStatement);
    deferred = Q.defer();

    BingoCard.count(queryObject).exec( function(error, result) {
        if(error) {
            deferred.reject(error);
        } else {
            deferred.resolve(result);
        }
    });

    return deferred.promise;
};

exports.generateSquares = function (serverSeed, clientSeed, nonce) {

    var squares, hash, squareIndex, characterIndex, subsitute, decimal, hashCharacters;

    squares = [ [], [], [], [], [] ];

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