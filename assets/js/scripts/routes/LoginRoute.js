App.LoginRoute = Ember.Route.extend({
    setupController: function(controller, model) {
        controller.set('errorMessage', null);
    },
    actions: {
        sessionAuthenticationSucceeded: function() {
            Ember.RSVP.hash({
                deposits: this.store.find('deposit', { user: this.get('session.id') }),
                withdrawals: this.store.find('withdrawal', { user: this.get('session.id') })
            });
            this.transitionTo('games');
        }
    }
});