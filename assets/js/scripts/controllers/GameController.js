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
        gameId = this.get('session.content').id;

        return this.get('store').filter('bingoCard', function (bingoCard) {
            return (bingoCard.get('game.id') === gameId && bingoCard.get('user.id') === gameId);
        });
    }.property('model.bingoCards'),

    actions: {

        buyCard: function () {
            var store, game, bingoCard, bingoCards;

            store = this.store;
            game = this.get('model');
            bingoCards = this.get('bingoCards');

            bingoCard = store.createRecord('bingoCard', {
                clientSeed: "12345",
                game: game
            });

            bingoCard.save();
        }
    }
});