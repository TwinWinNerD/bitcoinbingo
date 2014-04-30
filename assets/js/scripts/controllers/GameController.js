App.GameController = Ember.ObjectController.extend({



    idle: function () {
        if(this.get('model.gameStatus') === 'idle') {
            return true;
        }
        return false;
    }.property('model.gameStatus'),

    playing: function () {
        if(this.get('model.gameStatus') === 'playing') {
            return true;
        }
        return false;
    }.property('model.gameStatus'),

    finished: function () {
        if(this.get('model.gameStatus') === 'finished') {
            return true;
        }
        return false;
    }.property('model.gameStatus'),

    cardPrice: function () {
        return satoshiToMBTC(this.get('model.table.cardPrice'));
    }.property('model.table.cardPrice'),


    drawnNumbers: function () {
        var drawnNumbers, lastNumber;

        drawnNumbers = this.get('model.drawnNumbers');
        lastNumber = drawnNumbers[drawnNumbers.length - 1];

        // TODO: fix problem whenever we get a new number the bingoCards get rerenderd so only the newest number is marked
        $("#h-cards td.number[data-number='" + lastNumber + "']").addClass('marked');
        $("#h-drawn-numbers .number[data-number='" + lastNumber + "']").addClass('active');

    }.observes('model.drawnNumbers'),

    ownBingoCards: function () {
        var gameId, userId;
        gameId = this.get('id');
        userId = this.get('session.content.id');

        return this.get('store').filter('bingoCard', function (bingoCard) {
            return (bingoCard.get('game.id') === gameId && bingoCard.get('user.id') === userId);
        });
    }.property('model.bingoCards', 'session.content'),

    actions: {

        buyCard: function () {
            var store, game, clientSeed, amountOfCards, bingoCard, bingoCards;

            store = this.store;
            game = this.get('model');
            bingoCards = this.get('bingoCards');

            // if no new clientSeed is set, use the one saved in the session
            clientSeed = this.get('clientSeed') ? this.get('clientSeed') : this.get('session.clientSeed');
            amountOfCards = this.get('amountOfCards') ? this.get('amountOfCards') : 1;

            for(var i = 1; i <= amountOfCards; i++) {
                bingoCard = store.createRecord('bingoCard', {
                    clientSeed: clientSeed,
                    game: game
                });

                bingoCard.save().then(function (newBingoCard) {
                    game.set('errorMessage', null);
                    bingoCards.pushObject(newBingoCard);
                    game.reload();

                    $('#buy-cards-modal').modal('hide');
                }, function (error) {
                    game.set('errorMessage', error.error);
                });
            }


        }
    }
});