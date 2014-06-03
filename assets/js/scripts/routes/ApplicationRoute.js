App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
    beforeModel: function () {
        if(!this.get('session.isAuthenticated')) {
            this.transitionTo('register');
        }
    },
    model: function () {
        if(this.get('session.isAuthenticated')) {
            return Ember.RSVP.hash({
                deposits: this.store.find('deposit', { user: this.get('session.id') }),
                withdrawals: this.store.find('withdrawal', { user: this.get('session.id') })
            });
        }
    },
    setupController: function (controller, model) {
        if(this.get('session.isAuthenticated')) {
            this.controllerFor('wallet').set('deposits', model.deposits);
            this.controllerFor('wallet').set('withdrawals', model.withdrawals);
        }
    }
});
