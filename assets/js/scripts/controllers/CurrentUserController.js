App.CurrentUserController = Ember.ArrayController.extend({
    username: function () {
        return this.get('session.username');
    }.property('username')
});