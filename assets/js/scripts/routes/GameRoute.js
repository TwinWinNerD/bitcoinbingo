App.GameRoute = Ember.Route.extend({
    model: function (params) {
        return this.store.find('game', params.game_id);
    },
    setupController: function (controller, model) {

        model.reload();

        controller.set('model', model);
    },
});