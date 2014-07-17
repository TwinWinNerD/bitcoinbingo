App.WalletController = Ember.ArrayController.extend({
    errorMessage: null,
    successMessage: null,
    withdrawalAmount: 0,
    userDeposits: function () {
        var userId = this.get('session.content.id');

        return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
            sortProperties: ['createdAt'],
            sortAscending: false,
            content: this.store.filter('deposit', function(deposit) {
                return deposit.get('user.id') == userId;
            })
        });
    }.property('deposits'),
    last20userDeposits: function () {
        return this.get('userDeposits').toArray().slice(0, 20)
    }.property('userDeposits.[]'),
    userWithdrawals: function () {
        var userId = this.get('session.content.id');

        return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
            sortProperties: ['createdAt'],
            sortAscending: false,
            content: this.store.filter('withdrawal', function(withdrawal) {
                return withdrawal.get('user.id') == userId;
            })
        });
    }.property('withdrawals'),
    last20userWithdrawals: function () {
        return this.get('userWithdrawals').toArray().slice(0, 20)
    }.property('userWithdrawals.[]'),

    actions: {
        withdraw: function () {
            var self = this;

            var withdrawButton = Ladda.create(document.querySelector('#withdrawButton'));
            withdrawButton.start();

            var withdrawalAddress = this.get('withdrawalAddress');
            var withdrawalAmount = this.get('withdrawalAmount') * 100; // Bits * 100 = satoshi's

            var data = {
                address: withdrawalAddress,
                amount: withdrawalAmount
            };

            self.set('errorMessage', null);
            socket.post('/api/withdrawal', data, function (result) {
                withdrawButton.stop();
                if(typeof result.error !== 'undefined') {
                    self.set('errorMessage', result.error);
                } else {
                    var message = result.message;
                    self.set('successMessage', message);
                }
            });
        }
    }
});