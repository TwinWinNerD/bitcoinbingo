App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
    beforeModel: function () {
        console.log(this.get('session.isAuthenticated'));
        if(!this.get('session.isAuthenticated')) {
            this.transitionTo('register');
        }
    },
    actions: {
        register: function () {
            console.log("test");
        }
    }
});
