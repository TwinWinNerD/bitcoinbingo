App.WalletController = Ember.ArrayController.extend({
    userDeposits: function () {
        var userId = this.get('session.content.id');

        return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
            sortProperties: ['createdAt'],
            sortAscending: false,
            content: this.store.filter('deposit', function(deposit) {
                return deposit.get('user.id') === userId;
            })
        });
    }.property('deposits'),
    last20userDeposits: function () {
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

        return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
            sortProperties: ['createdAt'],
            sortAscending: false,
            content: this.store.filter('withdrawal', function(withdrawal) {
                return withdrawal.get('user.id') === userId;
            })
        });
    }.property('withdrawals'),
    last20userWithdrawals: function () {
        var amountOfWithdrawals, startIndex;

        amountOfWithdrawals = this.get('userWithdrawals.length');

        if(amountOfWithdrawals > 15) {
            startIndex = amountOfWithdrawals - 15;
        } else {
            startIndex = 0;
        }

        return this.get('userWithdrawals').toArray().slice(startIndex)
    }.property('userWithdrawals.[]')
});