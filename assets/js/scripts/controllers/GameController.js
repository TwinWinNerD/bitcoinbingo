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

    actions: {

        buyCard: function () {
            var store, game, bingoCard;



            store = this.store;
            game = this.get('model');


            bingoCard = store.createRecord('bingoCard', {
                clientSeed: "12345",
                game: game
            });

            bingoCard.save();

        }

    }
});