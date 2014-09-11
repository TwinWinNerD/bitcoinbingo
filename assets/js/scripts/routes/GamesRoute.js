App.GamesRoute = Ember.Route.extend({
  model: function () {
    if (!this.controllerFor('games').get('loadedGames')) {
      return Ember.RSVP.hash({
        modelIdleGames: this.store.find('game', { gameStatus: 'idle' }),
        modelCountDownGames: this.store.find('game', { gameStatus: 'countDown' }),
        modelPlayingGames: this.store.find('game', { gameStatus: 'playing' }),
        modelFinishedGames: this.store.find('game', { 'gameStatus': 'finished', 'limit': 5, 'sort': 'updatedAt DESC' })
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
        }),
        modelFinishedGames: this.store.filter('game', function (game) {
          return (game.get('gameStatus') === "finished");
        })
      });
    }
  },
  setupController: function (controller, model) {
    controller.set('modelIdleGames', model.modelIdleGames);
    controller.set('modelCountDownGames', model.modelCountDownGames);
    controller.set('modelPlayingGames', model.modelPlayingGames);
    controller.set('modelFinishedGames', model.modelFinishedGames);
    controller.set('loadedGames', true);
  }
});