App.MessageController = Ember.ObjectController.extend({
    isUserMessage: function () {
        return this.get('model.type') === 'user';
    }.property('model.type'),
    isSystemMessage: function () {
        return this.get('model.type') === 'system';
    }.property('model.type')
});