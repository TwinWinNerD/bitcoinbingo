App.RegisterView = Ember.View.extend({
  didInsertElement: function () {
    Ember.run.scheduleOnce('afterRender', this, function () {
      Pace.on('done', function () {
        var registerButton = $("#registerButton");
        registerButton.removeClass('disabled');
        registerButton.removeAttr('disabled');
      })
    });
  }
});