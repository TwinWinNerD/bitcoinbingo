App.NumberController = Ember.ObjectController.extend({
  needs: ['game'],
  drawnNumbers: Ember.computed.alias('controllers.game.drawnNumbers'),
  isActive: function () {
    var item, drawnNumbers;

    item = this.get('model.number') ? this.get('model.number') : this.get('model');
    drawnNumbers = this.get('drawnNumbers');

    return drawnNumbers.indexOf(item) !== -1;
  }.property('drawnNumbers')
});