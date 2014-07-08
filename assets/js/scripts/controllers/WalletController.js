App.WalletController = Ember.ArrayController.extend({
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
    }.property('userWithdrawals.[]')
});