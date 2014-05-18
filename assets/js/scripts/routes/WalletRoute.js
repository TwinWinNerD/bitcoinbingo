App.WalletRoute = Ember.Route.extend({
    model: function () {
        return Ember.RSVP.hash({
            deposits: this.store.find('deposit', { user: this.get('session.id') }),
            withdrawals: this.store.find('withdrawal', { user: this.get('session.id') })
        });
    },

    setupController: function (controller, model) {
        controller.set('deposits', model.deposits);
        controller.set('withdrawals', model.withdrawals);
    }
});