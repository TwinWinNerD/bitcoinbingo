App.GamesRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('game');
    }
});