App.GameController = Ember.ObjectController.extend({
    needs: ['number'],

    identifier: function () {
        return this.get('model.id').slice(-5);
    }.property('model.id'),

    players: function () {
        var bingoCards, users;

        bingoCards = this.get('gameBingoCards');
        users = [];

        bingoCards.forEach(function (bingoCard) {
            users.push(bingoCard.get('user'));
        });

        return users.uniq();
    }.property('amountOfCards'),

    amountOfPlayers: function () {
        return this.get('players').length;
    }.property('players.[]'),

    prizePool: function () {
        return parseFloat(satoshiToBits((this.get('amountOfCards') * this.get('model.table.cardPrice')) * 0.95).toFixed(8));
    }.property('amountOfCards', 'model.table.cardPrice'),

    patternPrize: function () {
        return parseFloat((this.get('prizePool') * 0.30).toFixed(8));
    }.property('prizePool'),

    bingoPrize: function () {
        return parseFloat((this.get('prizePool') * 0.70).toFixed(8));
    }.property('prizePool'),

    amountOfCards: function () {
        return this.get('gameBingoCards.length');
    }.property('gameBingoCards.[]'),

    gameBingoCards: function () {
        var gameId;
        gameId = this.get('id');

        return this.get('store').filter('bingoCard', function (bingoCard) {
            return (bingoCard.get('game.id') === gameId);
        });
    }.property('modelBingoCards'),

    userParticipating: function () {
        if(this.get('ownBingoCards.length') > 0 && (this.get('idle') || this.get('playing'))) {
            return true;
        } else {
            return false;
        }
    }.property('ownBingoCards.[]'),

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
        return satoshiToBits(this.get('model.table.cardPrice'));
    }.property('model.table.cardPrice'),

    latestNumber: function () {
        var drawnNumbers, latestNumber;

        drawnNumbers = this.get('drawnNumbers');

        if(drawnNumbers.length > 0) {
            latestNumber = drawnNumbers[drawnNumbers.length-1];

            if(this.get('model.gameStatus') === 'playing') {
                document.getElementById("sound_number_" + latestNumber).play();
            }

            return latestNumber;
        }
        
    }.property('model.drawnNumbers'),

    gameMessages: function () {
        var gameId = this.get('id');

        return this.get('store').filter('message', function (message) {
            return (message.get('game.id') === gameId);
        });
    }.property('modelMessages'),

    lastMessages: function() {
        var amountOfMessages, startIndex;

        amountOfMessages = this.get('gameMessages.length');

        if(amountOfMessages > 20) {
            startIndex = amountOfMessages - 20;
        } else {
            startIndex = 0;
        }

        return this.get('gameMessages').toArray().slice(startIndex)
    }.property('gameMessages.[]'),


    ownBingoCards: function () {
        var gameId, userId;
        gameId = this.get('id');
        userId = this.get('session.content.id');

        return this.get('store').filter('bingoCard', function (bingoCard) {
            return (bingoCard.get('game.id') === gameId && bingoCard.get('user.id') === userId);
        });
    }.property('gameBingoCards', 'session.content'),

    gameWinners: function() {
        var gameId;
        gameId = this.get('id');

        return this.get('store').filter('winner', function (winner) {
            return (winner.get('game.id') === gameId);
        });
    }.property('model.winners'),

    canBuyCards: function () {
        return (this.get('ownBingoCards.content.length') < this.get('model.table.maximumCards') && (this.get('idle')));
    }.property('ownBingoCards','idle'),

    actions: {

        buyCard: function () {
            var store, game, user, clientSeed, amountOfCards, bingoCard, bingoCards, buyCardButton;

            store = this.store;
            game = this.get('model');
            bingoCards = this.get('bingoCards');

            buyCardButton = Ladda.create(document.querySelector('#buyCardButton'));

            buyCardButton.start();

            user = store.getById('user', this.get('session.content.id'));
            clientSeed = user.get('clientSeed');

            amountOfCards = 1;

            for(var i = 1; i <= amountOfCards; i++) {

                bingoCard = store.createRecord('bingoCard', {
                    clientSeed: clientSeed,
                    user: user,
                    game: game
                });

                bingoCard.save().then(function (newBingoCard) {
                    game.set('errorMessage', null);
                    bingoCards.pushObject(newBingoCard);
                    buyCardButton.stop();
                }, function (error) {
                    buyCardButton.stop();
                    bingoCard.deleteRecord();
                    game.set('errorMessage', error.error);
                });
            }
        },

        sendMessage: function () {
            var store, game, messages, message, record, user, self;

            store = this.store;
            game = this.get('model');
            messages = this.get('messages');
            message = this.get('message');
            user = this.get('session.username');
            self = this;

            if(message.trim() !== "") {
                record = store.createRecord('message', {
                    game: game,
                    body: message,
                    user: user
                });

                record.save().then(function (newMessage) {
                    self.set('message','');
                    messages.pushObject(newMessage);
                }, function (error) {
                    // handle error
                });
            }
        }
    }
});