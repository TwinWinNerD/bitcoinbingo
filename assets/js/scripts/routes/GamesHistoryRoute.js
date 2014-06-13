App.GamesHistoryRoute = Ember.Route.extend({
    model: function () {
        return Ember.RSVP.hash({
            lastPersonalGames: this.store.find('game', { user: this.get('session.id') })
        });
    },
    setupController: function (controller, model) {
        controller.set('lastPersonalGames', model.lastPersonalGames);
    }
});