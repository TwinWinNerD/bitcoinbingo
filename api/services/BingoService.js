var Q, _;

Q = require('q');
_ = require('lodash');

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
                deferred.resolve(winners);
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

    var bingoNumbers, masterSeed, bingoWinners, patternWinners, turn, drawnNumbers;

    bingoNumbers = new BingoNumbersService();
    masterSeed = SeedService.generateMasterSeed(game);
    bingoNumbers.shuffle(masterSeed);

    bingoWinners = [];
    patternWinners = [];

    drawnNumbers = [];
    turn = 0;

    if(!instant) {

        var playTurn = function () {
            drawNumber(bingoNumbers, turn).then( function(number) {

                drawnNumbers.push(number);

                bingoWinners = checkForWinners('bingo', game.bingoCards, drawnNumbers);
                patternWinners = checkForWinners('pattern', game.bingoCards, drawnNumbers);

                console.log(number);

                console.log(patternWinners);
                console.log(bingoWinners);

                if (bingoWinners.length > 0) {
                    deferred.resolve({ bingoWinners: bingoWinners, patternWinners: patternWinners });
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

            bingoWinners = checkForWinners('bingo', game.bingoCards, drawnNumbers);
            patternWinners = checkForWinners('pattern', game.bingoCards, drawnNumbers);

            console.log(bingoWinners);
            console.log(patternWinners);

            if (bingoWinners.length > 0) {
                deferred.resolve({ bingoWinners: bingoWinners, patternWinners: patternWinners });
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

        winners = _.uniq(winners, function (winner) { return JSON.stringify(winner); });

        return winners;
    }

    return [];
}