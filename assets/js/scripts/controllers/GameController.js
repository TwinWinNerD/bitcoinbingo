App.GameController = Ember.ObjectController.extend({
    needs: ['number'],

    idle: function () {
        if(this.get('model.gameStatus') === 'idle' || this.get('model.gameStatus') === 'countDown') {
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

    gameWinners: function() {
        var gameId;
        gameId = this.get('id');

        return this.get('store').filter('winner', function (winner) {
            return (winner.get('game.id') === gameId);
        });
    }.property('model.winners'),

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
            var store, game, messages, message, record, self;

            store = this.store;
            game = this.get('model');
            messages = this.get('messages');
            message = this.get('message');
            self = this;


            record = store.createRecord('message', {
                game: game,
                body: message
            });

            record.save().then(function (newMessage) {
                self.set('message','');

//                $(".chat-widget").slimScroll({ scrollTo: $('.chat-widget')[0].scrollHeight});

                // reset error
                // game.set('errorMessage', null);
                messages.pushObject(newMessage);
            }, function (error) {
                // handle error
            });

        }
    }
});