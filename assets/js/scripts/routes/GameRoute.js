App.GameRoute = Ember.Route.extend({
  model: function (params) {
    return this.store.find('game', params.game_id);
  },
  setupController: function (controller, model) {
    model.reload();

    controller.set('model', model);
    controller.set('modelBingoCards', model.get('bingoCards'));
    controller.set('modelMessages', model.get('messages'));
  },

  actions: {
    showWinnerModal: function () {
      this.render('winnerModal', {
        into: 'game',
        outlet: 'modal'
      });
    },
    close: function () {
      this.disconnectOutlet({outlet: 'modal', parentView: 'game'});
    }
  }
});