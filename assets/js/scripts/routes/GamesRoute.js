App.GamesRoute = Ember.Route.extend({
    model: function () {
        return Ember.RSVP.hash({
            modelIdleGames: this.store.find('game', { gameStatus: 'idle' }),
            modelCountDownGames: this.store.find('game', { gameStatus: 'countDown' }),
            modelPlayingGames: this.store.find('game', { gameStatus: 'playing' })
        });
    },
    setupController: function (controller, model) {
        controller.set('modelIdleGames', model.modelIdleGames);
        controller.set('modelCountDownGames', model.modelCountDownGames);
        controller.set('modelPlayingGames', model.modelPlayingGames);
    }
});