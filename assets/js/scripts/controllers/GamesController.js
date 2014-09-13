App.GamesController = Ember.ArrayController.extend({
  itemController: 'game',
  idleGames: function () {
    return this.store.filter('game', function (game) {
      return (game.get('status') === "idle" || game.get('status') === "countDown");
    });
  }.property('modelIdleGames', 'modelCountDownGames'),
  playingGames: function () {
    return this.store.filter('game', function (game) {
      return (game.get('status') === "playing");
    });
  }.property('modelPlayingGames'),
  finishedGames: function () {
    return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
      sortProperties: ['updatedAt'],
      sortAscending: false,
      content: this.store.filter('game', function (game) {
        return (game.get('status') === "finished");
      })
    });
  }.property('modelFinishedGames'),
  latestFinishedGames: function () {
    return this.get('finishedGames').toArray().slice(0, 5);
  }.property('finishedGames.[]')

});