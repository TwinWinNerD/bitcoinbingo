App.LoadingRoute = Ember.Route.extend({
  activate: function () {
    this._super();
    return Pace.restart();
  },
  deactivate: function () {
    this._super();
    return Pace.stop();
  }
});