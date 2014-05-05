App.GameController = Ember.ObjectController.extend({
    needs: ['number', 'message'],

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

    gameMessages: function () {
        var gameId;
        gameId = this.get('id');

        return this.get('store').filter('message', function (message) {
            return (message.get('game.id') === gameId);
        });
    }.property('model.messages'),


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
                    $('#buy-cards-modal').modal('hide');
                }, function (error) {
                    game.set('errorMessage', error.error);
                });
            }
        },

        sendMessage: function () {
            var store, game, messages, message, record;

            store = this.store;
            game = this.get('model');
            messages = this.get('messages');


            record = store.createRecord('message', {
                game: game,
                body: this.get('message')
            });

            record.save().then(function (newMessage) {
                // reset error
                // game.set('errorMessage', null);
                messages.pushObject(newMessage);
            }, function (error) {
                // handle error
            });

        }
    }
});