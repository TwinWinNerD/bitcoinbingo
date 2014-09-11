App.RegisterRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    controller.set('errorMessage', null);
  }
});