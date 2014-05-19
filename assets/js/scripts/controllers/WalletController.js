App.WalletController = Ember.ArrayController.extend({
    userDeposits: function () {
        var userId = this.get('session.content.id');
        return this.store.filter('deposit', function(deposit) {
            return deposit.get('user.id') === userId;
        });
    }.property('deposits'),
    userWithdrawals: function () {
        var userId = this.get('session.content.id');
        return this.store.filter('withdrawal', function(withdrawal) {
            return withdrawal.get('user.id') === userId;
        });
    }.property('withdrawals'),
    balance: function () {
        var deposits, totalDeposits, withdrawals, totalWithdrawals;

        deposits = this.get('userDeposits');
        withdrawals = this.get('userWithdrawals');


        totalDeposits = deposits.reduce(function (prev, deposit) {
            return prev + deposit.get('amount');
        }, 0);

        totalWithdrawals = withdrawals.reduce(function (prev, withdrawal) {
            return prev + withdrawal.get('amount');
        }, 0);

        console.log(totalDeposits);
        console.log(totalWithdrawals);

        return totalDeposits - totalWithdrawals;

    }.property('userDeposits.@each.amount', 'userWithdrawals.@each.amount')
});