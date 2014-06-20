App.GamesHistoryController = Ember.ArrayController.extend({
    itemController: 'game',
    lastPersonalGamesSorted: function () {
        return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
            sortProperties: ['updatedAt'],
            sortAscending: false,
            content: this.get('lastPersonalGames')
        });
    }.property('lastPersonalGames.[]')
});