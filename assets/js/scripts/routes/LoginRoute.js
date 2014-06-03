App.LoginRoute = Ember.Route.extend({
    // clear a potentially stale error message from previous login attempts
    setupController: function(controller, model) {
        controller.set('errorMessage', null);
    },
    actions: {
        // display an error when authentication fails
        sessionAuthenticationFailed: function(message) {
            this.controller.set('errorMessage', message);
        },
        sessionAuthenticationSucceeded: function() {
            Ember.RSVP.hash({
                deposits: this.store.find('deposit', { user: this.get('session.id') }),
                withdrawals: this.store.find('withdrawal', { user: this.get('session.id') })
            });
            this.transitionTo('games');
        }
    }
});