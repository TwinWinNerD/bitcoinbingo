/**
 * Seed generator
 */

var crypto;

crypto = require('crypto');

/**
 * Actions
 */

function generateSeed (length) {

    var seed = "";
    var allowedCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=";

    for(var i = 0; i < length; i++) {
        seed += allowedCharacters.charAt(Math.floor(Math.random() * allowedCharacters.length));
    }

    return seed;
}

exports.generateClientSeed = function () {
    return generateSeed(16);
};

exports.generateServerSeed = function () {
    return generateSeed(64);
};

exports.seedToInt = function (seed) {
    var hash = crypto.createHash('sha512');

    hash.update(seed);

    return parseInt(hash.digest('hex'), 16);
};

exports.generateMasterSeed = function (game) {

    var masterSeed;

    masterSeed = crypto.createHash('sha512');

    masterSeed.update(game.serverSeed);

    for(var i = 0; i < game.bingoCards.length; i++) {
        if(typeof game.bingoCards[i].clientSeed !== "undefined") {
            masterSeed.update(game.bingoCards[i].clientSeed);
        }
    }

    return parseInt(masterSeed.digest('hex'), 16);
};