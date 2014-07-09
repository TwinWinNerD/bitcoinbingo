var Q = require('q');
var request = require('request');

var alias = sails.config.blockchain.alias;
var password = sails.config.blockchain.password;
var password2 = sails.config.blockchain.password2;

exports.createAddress = function (user) {
    var deferred = Q.defer();
    var url = "https://blockchain.info/merchant/" + alias +"/new_address?password=" + password + "&second_password=" + password2 + "&label=" + user.id + " - " + user.username;

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);

            deferred.resolve(result);
        } else {
            deferred.reject(error);
        }
    });

    return deferred.promise;
};

exports.getBalance = function (address, confirmations) {
    var deferred = Q.defer();
    var url = "https://blockchain.info/merchant/" + alias +"/address_balance?password=" + password + "&confirmations=" + confirmations + "&address" + address;

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);

            deferred.resolve(result);
        } else {
            deferred.reject(error);
        }
    });

    return deferred.promise;
};

exports.sendTransaction = function (address, amount) {
    var deferred = Q.defer();
    var url = "https://blockchain.info/nl/merchant/" + alias +
        "/payment?password=" + password +
        "&second_password=" + password2 +
        "&to=" + address +
        "&amount=" + amount;

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);

            deferred.resolve(result);
        } else {
            deferred.reject(error);
        }
    });

    return deferred.promise;

};