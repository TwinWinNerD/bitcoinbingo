App.GamesHistoryRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
  model: function () {
    return Ember.RSVP.hash({
      lastPersonalGames: this.store.find('game', { user: this.get('session.id'), limit: 20, sort: 'updatedAt DESC' })
    });
  },
  setupController: function (controller, model) {
    controller.set('lastPersonalGames', model.lastPersonalGames);
  }
});