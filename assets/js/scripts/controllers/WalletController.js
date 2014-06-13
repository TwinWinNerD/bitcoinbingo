App.WalletController = Ember.ArrayController.extend({
    userDeposits: function () {
        var userId = this.get('session.content.id');
        return this.store.filter('deposit', function(deposit) {
            return deposit.get('user.id') === userId;
        });
    }.property('deposits'),
    last10userDeposits: function () {
        var amountOfDeposits, startIndex;

        amountOfDeposits = this.get('userDeposits.length');

        if(amountOfDeposits > 15) {
            startIndex = amountOfDeposits - 15;
        } else {
            startIndex = 0;
        }

        return this.get('userDeposits').toArray().slice(startIndex)
    }.property('userDeposits.[]'),
    userWithdrawals: function () {
        var userId = this.get('session.content.id');
        return this.store.filter('withdrawal', function(withdrawal) {
            return withdrawal.get('user.id') === userId;
        });
    }.property('withdrawals'),
    last10userWithdrawals: function () {
        var amountOfWithdrawals, startIndex;

        amountOfWithdrawals = this.get('userWithdrawals.length');

        if(amountOfWithdrawals > 15) {
            startIndex = amountOfWithdrawals - 15;
        } else {
            startIndex = 0;
        }

        return this.get('userWithdrawals').toArray().slice(startIndex)
    }.property('userWithdrawals.[]'),
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