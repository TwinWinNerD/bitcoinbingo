var Q, _, async;

Q = require('q');
_ = require('lodash');
async = require('async');

exports.updateGameStatus = function (gameId, status) {
    var deferred;

    deferred = Q.defer();

    Game.findOne(gameId)
        .exec(function (error, game) {
            Game.update(gameId, { gameStatus: status }).exec( function(error, result) {
                if(error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve();
                    Game.publishUpdate(gameId, { gameStatus: status, updatedAt: result[0].updatedAt }, null,{ previous: game.toJSON() });
                }
            });
        });

    return deferred.promise;
}

exports.settleRound = function (gameId, instant) {

    var awardPrizes, deferred;

    deferred = Q.defer();

    exports.updateGameStatus(gameId, "countDown").then(function () {

        countDown(10).then(function () {

            exports.updateGameStatus(gameId, "playing").then(function () {

                Game.findOne(gameId)
                    .populate('bingoCards')
                    .populate('table')
                    .exec(function (error, game) {

                        if(error) {
                            deferred.reject(error);
                        } else {
                            if(game.gameStatus === "playing" || game.gameStatus === "finished") {
                                exports.runSimulation(game, instant).then( function (winners) {

                                    rewardWinners(game, winners).then( function (result) {
                                        if(result) {
                                            exports.updateGameStatus(gameId, "finished").then( function () {
                                                game.gameStatus = "finished";

                                                Game.create({
                                                    minimumPlayers: game.minimumPlayers,
                                                    maximumPlayers: game.maximumPlayers,
                                                    table: game.table.id,
                                                    gameStatus: "idle",
                                                    serverSeed: SeedService.generateServerSeed(),
                                                    pattern: PatternService.getRandomPattern(),
                                                }).exec(function (error, result) {
                                                    Game.publishCreate(result);
                                                });

                                                deferred.resolve(winners);
                                            });
                                        }
                                    });

                                }, function (error) {
                                    // error
                                }, function (drawnNumbers) {

                                    Game.update(game.id, {
                                        drawnNumbers: drawnNumbers
                                    }).exec(function (error, result) {
                                        if(result) {

                                            // don't send this to the frontend again
                                            var gameData = _.cloneDeep(game);

                                            delete gameData.bingoCards;
                                            delete gameData.table;

                                            Game.publishUpdate(game.id, { drawnNumbers: result[0].drawnNumbers, updatedAt: result[0].updatedAt }, null,{ previous: gameData });
                                        }
                                    });
                                });
                            }
                        }
                    });
            });

        }, function (error) {

        }, function (second) {
            MessageService.sendSystemMessage("Game starting in " + second + " seconds", gameId);
        });

    });



    return deferred.promise;
};

exports.runSimulation = function (game, instant) {

    var deferred;
    deferred = Q.defer();

    // create all cards
    for(var i = 0; i < game.bingoCards.length; i++) {
        var bingoCard = game.bingoCards[i];

        bingoCard.squares = BingoCardService.generateSquares(game.serverseed, bingoCard.clientSeed, bingoCard.id);
    }

    var bingoNumbers, masterSeed, bingoWinners, patternWinners, winners, turn, drawnNumbers, notifiedPatternWinners;

    bingoNumbers = new BingoNumbersService();
    masterSeed = SeedService.generateMasterSeed(game);
    bingoNumbers.shuffle(masterSeed);

    bingoWinners = [];
    patternWinners = [];
    winners = [];

    notifiedPatternWinners = false;

    drawnNumbers = [];
    turn = 0;

    game.drawnNumbers = drawnNumbers;
    if(!instant) {

        var playTurn = function () {
            drawNumber(bingoNumbers, turn).then( function(number) {

                drawnNumbers.push(number);

                deferred.notify(drawnNumbers);

                // using cloneDeep to prevent the pattern check overwriting the bingo check

                if(patternWinners.length === 0) {
                    patternWinners = _.cloneDeep(checkForWinners('pattern', game.bingoCards, drawnNumbers, game.pattern));
                }

                if(patternWinners.length > 0) {
                    bingoWinners = _.cloneDeep(checkForWinners('bingo', game.bingoCards, drawnNumbers));
                }

                async.series([
                    function(done) {
                        if (patternWinners.length > 0 && notifiedPatternWinners === false) {

                            async.each(patternWinners, function (winner, done) {
                                User.findOne(winner.user).exec(function(error, result) {
                                    if(!error && result) {
                                        MessageService.sendSystemMessage("Pattern won by " + result.username, winner.game).then(function (resolve) {
                                            if(resolve) {
                                                done();
                                            }
                                        });
                                    } else {
                                        done(error);
                                    }
                                });
                            }, function(error, result) {
                                done();
                            });

                            notifiedPatternWinners = true;
                        } else {
                            done();
                        }
                    },
                    function(done) {
                        if (bingoWinners.length > 0) {

                            async.each(bingoWinners, function (winner, done) {
                                User.findOne(winner.user).exec(function(error, result) {
                                    if(!error && result) {
                                        MessageService.sendSystemMessage("Bingo won by " + result.username, winner.game).then(function (resolve) {
                                            if(resolve) {
                                                done();
                                            }
                                        });
                                    } else {
                                        done(error);
                                    }
                                });
                            });

                            winners.push(bingoWinners);
                            winners.push(patternWinners);
                            deferred.resolve(winners);
                        } else {
                            done();
                        }
                    }
                ], function(err, result) {
                    turn++;
                    playTurn();
                });
            });
        };

        // first turn
        playTurn();
    } else {

        var number;

        while (true) {

            number = instantlyDrawNumber(bingoNumbers, turn);
            drawnNumbers.push(number);

            bingoWinners = _.cloneDeep(checkForWinners('bingo', game.bingoCards, drawnNumbers));
            patternWinners = _.cloneDeep(checkForWinners('pattern', game.bingoCards, drawnNumbers, game.pattern));

            if (bingoWinners.length > 0) {
                winners.push(bingoWinners);
                winners.push(patternWinners);
                deferred.resolve(winners);
                break;
            } else {
                turn++;
            }
        }
    }

    return deferred.promise;
};

function instantlyDrawNumber(bingoNumbers, turn) {
    if (typeof bingoNumbers[turn] !== 'undefined') {
        return bingoNumbers[turn];
    }
}

function drawNumber(bingoNumbers, turn) {

    var deferred;
    deferred = Q.defer();

    setTimeout(function () {
        if (typeof bingoNumbers[turn] !== 'undefined') {
            deferred.resolve(bingoNumbers[turn]);
        }
    }, 2000);

    return deferred.promise;
}

function checkForWinners (type, cards, drawnNumbers, pattern) {

    var bingoCount, numbersForBingo, patternCount, numbersForPattern, winners;

    if(typeof pattern !== 'undefined') {
        numbersForPattern = PatternService.countAmountOfNumbersInPattern(pattern);
    }

    numbersForBingo = 24;
    winners = [];

    for(var x = 0; x < cards.length; x++) {

        bingoCount = 0;
        patternCount = 0;

        for(var i = 0; i < 5; i++) {

            for(var j = 0; j < 5; j++) {

                if(type === "bingo") {
                    // if the number is on any place on the card
                    if(drawnNumbers.indexOf(cards[x].squares[i][j]) !== -1) {
                        bingoCount++;
                    }
                } else if (type === "pattern") {
                    // if the number is on the place of the pattern
                    if(pattern[i][j] === 1) {
                        if(drawnNumbers.indexOf(cards[x].squares[i][j]) !== -1) {
                            patternCount++;
                        }
                    }
                }
            }
        }

        if(bingoCount === numbersForBingo) {
            cards[x].won = "bingo";

            winners.push(cards[x]);
        }

        if(patternCount === numbersForPattern) {
            cards[x].won = "pattern";

            winners.push(cards[x]);
        }
    }

    if(winners.length > 0) {

        return winners;
    }

    return [];
}

function rewardWinners (game, winners) {
    var deferred, prizePool, patternPercentage, bingoPercentage, winnerData, depositData;
    deferred = Q.defer();

    prizePool = calculatePrizePool(game);
    patternPercentage = 0.30;
    bingoPercentage = 0.70;

    winnerData = [];
    depositData = [];

    for(var i = 0; i < winners.length; i++) {
        var amountOfWinners;

        amountOfWinners = winners[i].length;

        for(var j = 0; j < amountOfWinners; j++) {
            var winner, winningCard, amount, type;
            winningCard = winners[i][j];
            winner = {};

            winner.winnerType = winningCard.won;
            winner.user = winningCard.user;
            winner.bingoCard = winningCard.id;
            winner.game = winningCard.game;

            if(winner.winnerType === "bingo") {
                amount = parseInt((prizePool * bingoPercentage) / amountOfWinners, 10);
                type = "Bingo won";
            } else if(winner.winnerType === "pattern") {
                amount = parseInt((prizePool * patternPercentage) / amountOfWinners, 10);
                type = "Pattern won";
            }

            winner.amount = amount;

            winnerData.push(winner);

            depositData.push({
                amount: winner.amount,
                depositType: type,
                user: winner.user
            });
        }
    }

    async.parallel([
        function (done) {
            Winner.create(winnerData).exec( function (error, result) {
                if(!error) {

                    for(var i = 0; i < result.length; i++) {
                        Winner.publishCreate(result[i]);
                    }


                    done();
                }
            });
        },
        function (done) {
            Deposit.create(depositData).exec( function (error, result) {
                if(!error) {

                    for(var i = 0; i < result.length; i++) {
                        Deposit.publishCreate(result[i]);
                    }

                    done();
                }
            });
        }
    ], function (error, results) {
        if(!error) {

            async.eachSeries(depositData, function (deposit, done) {
                User.findOne(deposit.user).exec(function (error, result) {
                    if(!error) {
                        var userBalance = result.balance;

                        userBalance += deposit.amount;

                        User.update(deposit.user, { balance: userBalance }).exec(function (error, result) {
                            if(!error) {
                                User.publishUpdate(deposit.user, { balance: userBalance }, null);
                                done(null,result);
                            } else {
                                done(error);
                            }
                        });
                    } else {
                        done(error);
                    }
                });
            }, function (error) {

                if(!error) {
                    deferred.resolve(results);
                } else {
                    deferred.reject(error);
                }
            });

        } else {
            deferred.reject(error);
        }
    });

    return deferred.promise;
}

function calculatePrizePool(game) {

    var cardPrice, amountOfCards;

    cardPrice = game.table.cardPrice;
    amountOfCards = game.bingoCards.length;

    console.log("cardprice " + cardPrice);
    console.log("amountOfCards " + amountOfCards);
    console.log("prizePool " + (cardPrice * amountOfCards) * 0.95);

    return (cardPrice * amountOfCards) * 0.95;
}

exports.minimumPlayersReached = function (gameId) {

    var deferred;

    deferred = Q.defer();

    Game.findOne(gameId).populate('bingoCards').populate('table').exec(function (error, result) {

        if(!error) {

            if(result) {

                var uniquePlayers;
                uniquePlayers = _.uniq(result.bingoCards, function (bingoCard) {
                    return bingoCard.user;
                });

                if(uniquePlayers.length >= result.table.minimumPlayers) {
                    deferred.resolve(true);
                } else {
                    deferred.resolve(false);
                }
            }

        } else {
           deferred.reject(error);
        }
    });

    return deferred.promise;
};

exports.startGame = function (gameId) {
    var deferred = Q.defer();

    exports.minimumPlayersReached(gameId).then( function (result) {
        if(result) {
            Game.findOne(gameId).exec(function (err, result) {
                deferred.resolve();
                if(result.gameStatus === 'idle') {
                    exports.settleRound(gameId, false);
                }
            })
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
};

function countDown(seconds) {

    var deferred, timer;
    deferred = Q.defer();

    timer = setInterval( function () {

        console.log("Starting game in", seconds);

        deferred.notify(seconds);

        seconds--;

        if(seconds === -1) {

            clearInterval(timer);

            deferred.resolve();
        }
    }, 1000);

    return deferred.promise;
}