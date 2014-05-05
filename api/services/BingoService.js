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
    awardPrizes = false;

    Game.findOne(gameId)
        .populate('bingoCards')
        .populate('table')
        .exec(function (error, game) {

        if(error) {
            deferred.reject(error);
        } else {

            async.series({
                readyToStart: function (done) {
                    if(game.gameStatus === "idle") {
                        awardPrizes = true;
                        instant = false;

                        exports.updateGameStatus(gameId, "playing").then(function () {
                            game.gameStatus = "playing";

                            countDown(10).then(function () {

                                done(null, true);
                            }, function (error) {

                            }, function (second) {
                                Message.create({
                                    user: "System",
                                    body: "Game starting in " + second + " seconds",
                                    game: gameId
                                }).exec(function created (err, newInstance) {
                                        Message.publishCreate(newInstance);


                                    });
                            });

                        });
                    } else {
                        done(null, true);
                    }
                }
            }, function (error, result) {
                if(result.readyToStart) {

                    if(game.gameStatus === "playing" || game.gameStatus === "finished") {
                        exports.runSimulation(game, instant).then( function (winners) {

                            if(awardPrizes) {
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
                                            }).exec(function (error, result) {
                                                    Game.publishCreate(result);
                                                });

                                            deferred.resolve(winners);
                                        });
                                    }
                                });
                            } else {
                                deferred.resolve(winners);
                            }

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
        }
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

    var bingoNumbers, masterSeed, bingoWinners, patternWinners, winners, turn, drawnNumbers;

    bingoNumbers = new BingoNumbersService();
    masterSeed = SeedService.generateMasterSeed(game);
    bingoNumbers.shuffle(masterSeed);

    bingoWinners = [];
    patternWinners = [];
    winners = [];

    drawnNumbers = [];
    turn = 0;

    game.drawnNumbers = drawnNumbers;
    if(!instant) {

        var playTurn = function () {
            drawNumber(bingoNumbers, turn).then( function(number) {

                drawnNumbers.push(number);

                deferred.notify(drawnNumbers);

//                // using cloneDeep to prevent the pattern check overwriting the bingo check
                bingoWinners = _.cloneDeep(checkForWinners('bingo', game.bingoCards, drawnNumbers));
                patternWinners = _.cloneDeep(checkForWinners('pattern', game.bingoCards, drawnNumbers));

                console.log(number);


                if (bingoWinners.length > 0) {
                    winners.push(bingoWinners);
                    winners.push(patternWinners);
                    deferred.resolve(winners);
                } else {
                    turn++;
                    playTurn();
                }
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
            patternWinners = _.cloneDeep(checkForWinners('pattern', game.bingoCards, drawnNumbers));

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
    }, 100);

    return deferred.promise;
}

function checkForWinners (type, cards, drawnNumbers) {

    var bingoCount, numbersForBingo, pattern, patternCount, numbersForPattern, winners;

    pattern = [ [1,1,1,1,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,1,1,1,1] ];
    numbersForPattern = PatternService.countAmountOfNumbersInPattern(pattern);
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
            var winner, winningCard, amount;
            winningCard = winners[i][j];
            winner = {};

            winner.winnerType = winningCard.won;
            winner.user = winningCard.user;
            winner.bingoCard = winningCard.id;
            winner.game = winningCard.game;

            if(winner.winnerType === "bingo") {
                amount = parseInt((prizePool * bingoPercentage) / amountOfWinners, 10);
            } else if(winner.winnerType === "pattern") {
                amount = parseInt((prizePool * patternPercentage) / amountOfWinners, 10);
            }

            winner.amount = amount;

            winnerData.push(winner);

            depositData.push({
                amount: winner.amount,
                depositType: "winnings",
                user: winner.user
            });
        }
    }

    async.parallel([
        function (done) {
            Winner.create(winnerData).exec( function (error, result) {
                if(!error) {
                    done();
                }
            });
        },
        function (done) {
            Deposit.create(depositData).exec( function (error, result) {
                if(!error) {
                    done();
                }
            });
        }
    ], function (error, results) {
        if(!error) {
            deferred.resolve(results);
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