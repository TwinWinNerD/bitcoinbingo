var Q;

Q = require('q');

exports.sendSystemMessage = function (body, game) {
    var message, deferred;

    deferred = Q.defer();

    message = {
        user: "System",
        body: body,
        type: "system",
        game: game
    };

    Message.create(message).exec(function (error, newInstance) {
        if(!error && newInstance) {

            Message.publishCreate(newInstance);

            deferred.resolve(true);
        }

    });

    return deferred.promise;
};