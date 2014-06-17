App.WalletRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    model: function () {
        if(!this.controllerFor('wallet').get('loadedWallet')) {
            return Ember.RSVP.hash({
                deposits: this.store.find('deposit', { user: this.get('session.id') }),
                withdrawals: this.store.find('withdrawal', { user: this.get('session.id') })
            });
        } else {
            var userId = this.get('session.content.id');

            return Ember.RSVP.hash({
                deposits: this.store.filter('deposit', function(withdrawal) {
                    return withdrawal.get('user.id') === userId;
                }),
                withdrawals: this.store.filter('withdrawal', function(withdrawal) {
                    return withdrawal.get('user.id') === userId;
                })
            });
        }
    },

    setupController: function (controller, model) {
        controller.set('deposits', model.deposits);
        controller.set('withdrawals', model.withdrawals);
        controller.set('loadedWallet', true);
    }
});