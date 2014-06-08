App.CurrentUserController = Ember.ArrayController.extend({
    needs: ['wallet'],
    username: function () {
        return this.get('session.username');
    }.property('username'),

    balance: function () {
        return satoshiToBits(this.get('controllers.wallet.balance'));
    }.property('balance', 'controllers.wallet.balance')
});