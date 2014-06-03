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
    }.property('modelPlayingGames')

});