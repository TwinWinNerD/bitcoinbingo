App.GamesRoute = Ember.Route.extend({
  model: function () {
    if (!this.controllerFor('games').get('loadedGames')) {
      return Ember.RSVP.hash({
        modelIdleGames: this.store.find('game', { status: 'idle' }),
        modelCountDownGames: this.store.find('game', { status: 'countDown' }),
        modelPlayingGames: this.store.find('game', { status: 'playing' }),
        modelFinishedGames: this.store.find('game', { 'status': 'finished', 'limit': 5, 'sort': 'updatedAt DESC' })
      });
    } else {
      return Ember.RSVP.hash({
        modelIdleGames: this.store.filter('game', function (game) {
          return (game.get('status') === "idle")
        }),
        modelCountDownGames: this.store.filter('game', function (game) {
          return (game.get('status') === "countDown")
        }),
        modelPlayingGames: this.store.filter('game', function (game) {
          return (game.get('status') === "playing");
        }),
        modelFinishedGames: this.store.filter('game', function (game) {
          return (game.get('status') === "finished");
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