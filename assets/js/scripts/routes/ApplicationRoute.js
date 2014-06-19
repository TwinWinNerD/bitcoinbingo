App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
    beforeModel: function () {
        if(!this.get('session.isAuthenticated')) {
            this.transitionTo('register');
        }
    },
    model: function () {
        if(this.get('session.isAuthenticated')) {
            return this.store.find('user', this.get('session.id'));
        }
    }
});
