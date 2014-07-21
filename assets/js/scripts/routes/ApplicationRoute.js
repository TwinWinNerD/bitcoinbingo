App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
    beforeModel: function () {
        if(!this.get('session.isAuthenticated')) {
            this.transitionTo('register');
        }
    },
    model: function () {
        var self = this;
        if(this.get('session.isAuthenticated')) {
            return this.store.find('user', this.get('session.id')).then(function () {

            }, function () {
                self.get('session').invalidate();
            });
        }

        return Ember.RSVP.hash({
            modelMessages: this.store.find('chat', { limit: 20, 'sort': 'updatedAt DESC' })
        });
    },
    setupController: function (controller, model) {
        controller.set('model', model);
    }
});
