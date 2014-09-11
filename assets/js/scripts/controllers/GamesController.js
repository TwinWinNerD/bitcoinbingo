App.GamesController = Ember.ArrayController.extend({
  itemController: 'game',
  idleGames: function () {
    return this.store.filter('game', function (game) {
      return (game.get('gameStatus') === "idle" || game.get('gameStatus') === "countDown");
    });
  }.property('modelIdleGames', 'modelCountDownGames'),
  playingGames: function () {
    return this.store.filter('game', function (game) {
      return (game.get('gameStatus') === "playing");
    });
  }.property('modelPlayingGames'),
  finishedGames: function () {
    return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
      sortProperties: ['updatedAt'],
      sortAscending: false,
      content: this.store.filter('game', function (game) {
        return (game.get('gameStatus') === "finished");
      })
    });
  }.property('modelFinishedGames'),
  latestFinishedGames: function () {
    return this.get('finishedGames').toArray().slice(0, 5);
  }.property('finishedGames.[]')

});