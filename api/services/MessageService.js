exports.sendSystemMessage = function (body, game) {
    var message;

    message = {
        user: "System",
        body: body,
        game: game
    };

    Message.create(message).exec(function created (err, newInstance) {
        Message.publishCreate(newInstance);
    });

}