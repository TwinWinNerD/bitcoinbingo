App.GameController = Ember.ObjectController.extend({

    setupController: function (controller, model) {
        controller.set('model', model);
    },

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

    bingoCards: function () {
        var gameId, userId;
        gameId = this.get('id');
        userId = this.get('session.content').id;

        // TODO: when coming from the #games view this is empty

        return this.get('store').filter('bingoCard', function (bingoCard) {
            return (bingoCard.get('game.id') === gameId && bingoCard.get('user.id') === userId);
        });
    }.property('model.bingoCards'),

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

                bingoCard.save();
            }

            $('#buy-cards-modal').modal('hide');
        }
    }
});