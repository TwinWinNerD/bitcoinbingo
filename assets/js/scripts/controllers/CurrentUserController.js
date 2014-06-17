App.CurrentUserController = Ember.ArrayController.extend({
    needs: ['wallet'],
    id: function () {
        return this.get('session.id');
    }.property('session.id'),
    username: function () {
        return this.get('session.username');
    }.property('session.username'),
    email: function () {
        return this.get('session.email');
    }.property('session.email'),
    clientSeed: function () {
        return this.get('session.clientSeed');
    }.property('session.email'),
    password: function () {
        return this.get('session.password');
    }.property('session.email'),
    balance: function () {
        return satoshiToBits(this.get('controllers.wallet.balance'));
    }.property('balance', 'controllers.wallet.balance')
});