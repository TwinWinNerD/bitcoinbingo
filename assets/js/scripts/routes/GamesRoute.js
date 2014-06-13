App.GamesRoute = Ember.Route.extend({
    model: function () {
        if(!this.controllerFor('games').get('loadedGames')) {
            return Ember.RSVP.hash({
                modelIdleGames: this.store.find('game', { gameStatus: 'idle' }),
                modelCountDownGames: this.store.find('game', { gameStatus: 'countDown' }),
                modelPlayingGames: this.store.find('game', { gameStatus: 'playing' })
            });
        } else {
            return Ember.RSVP.hash({
                modelIdleGames: this.store.filter('game', function (game) {
                    return (game.get('gameStatus') === "idle")
                }),
                modelCountDownGames: this.store.filter('game', function (game) {
                    return (game.get('gameStatus') === "countDown")
                }),
                modelPlayingGames: this.store.filter('game', function (game) {
                    return (game.get('gameStatus') === "playing");
                })
            });
        }
    },
    setupController: function (controller, model) {
        controller.set('modelIdleGames', model.modelIdleGames);
        controller.set('modelCountDownGames', model.modelCountDownGames);
        controller.set('modelPlayingGames', model.modelPlayingGames);
        controller.set('loadedGames', true);
    }
});