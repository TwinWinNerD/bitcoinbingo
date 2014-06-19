App.LoginRoute = Ember.Route.extend({
    setupController: function(controller, model) {
        controller.set('errorMessage', null);
    },
    actions: {
        sessionAuthenticationSucceeded: function() {
            var self = this;
            return this.store.find('user', { user: this.get('session.id') }).then(function () {
                self.transitionTo('games');
            });
        }
    }
});