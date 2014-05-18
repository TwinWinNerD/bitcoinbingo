App.WalletController = Ember.ArrayController.extend({
    userDeposits: function () {
        var userId = this.get('session.content.id');
        return this.store.filter('deposit', function(deposit) {
            return deposit.get('user.id') === userId;
        });
    }.property('deposits'),
    userWithdrawals: function () {
        var userId = this.get('session.content.id');
        return this.store.filter('deposit', function(deposit) {
            return deposit.get('user.id') === userId;
        });
    }.property('withdrawals')
});