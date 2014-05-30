App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
    beforeModel: function () {
        if(!this.get('session.isAuthenticated')) {
            this.transitionTo('register');
        }
    }
});
