App.WinnerModalView = Ember.View.extend({
  didInsertElement: function () {
    Ember.run.next(this, function () {
      this.$('.modal, .modal-backdrop').addClass('in');
    });
  },

  layoutName: 'modal_layout',

  actions: {

    close: function () {
      var view = this;

      this.$('.modal, .modal-backdrop').one("transitionend", function (ev) {
        view.controller.send('close');
      });

      this.$('.modal').removeClass('in');
    }
  }
});