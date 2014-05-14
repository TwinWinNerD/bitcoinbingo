App.GamesRoute = Ember.Route.extend({
    model: function () {
        return Ember.RSVP.hash({
            idleGames: this.store.find('game', { gameStatus: "idle" }),
            playingGames: this.store.find('game', { gameStatus: "playing" })
        });
    },
    setupController: function(controller, model) {
        controller.set('idleGames', model.idleGames);
        controller.set('playingGames', model.playingGames);
    }

});