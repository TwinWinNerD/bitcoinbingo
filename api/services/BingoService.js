var Q, _, async;

Q = require('q');
_ = require('lodash');
async = require('async');

exports.settleRound = function (gameId, instant) {

    var awardPrizes, deferred;

    deferred = Q.defer();
    awardPrizes = false;

    Game.findById(gameId)
        .populate('bingoCards')
        .populate('table')
        .exec(function (error, result) {

        if(error) {
            deferred.reject(error);
        } else {
            var game = result[0];

            if(game.gameStatus === "idle") {
                awardPrizes = true;
                instant = false;
            }

            exports.runSimulation(game, instant).then( function (winners) {

                if(awardPrizes) {
                    console.log("award prizes");
                    rewardWinners(game, winners).then( function (result) {
                        if(result) {

                            deferred.resolve(winners);

                        }
                    });
                } else {
                    deferred.resolve(winners);
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

    if(!instant) {

        var playTurn = function () {
            drawNumber(bingoNumbers, turn).then( function(number) {

                drawnNumbers.push(number);

                // using cloneDeep to prevent the pattern check overwriting the bingo check
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
            winner.player = winningCard.player;
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
                    type: "winnings",
                player: winner.player
            });
        }
    }

    async.parallel([
        function (cb) {
            Winner.create(winnerData).exec( function (error, result) {
                if(!error) {
                    cb();
                }
            });
        },
        function (cb) {
            Deposit.create(depositData).exec( function (error, result) {
                if(!error) {
                    cb();
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