App.ApplicationView = Ember.View.extend({
  didInsertElement: function () {
    $('.tooltip-sidebar-toggle, .tooltip-sidebar-logout').tooltip({
      selector: "[data-toggle=tooltip]",
      container: "body"
    });

    Ladda.bind('.ladda-button', {
      timeout: 2000
    });

    var generalChat = $("#general-chat");

    $('.navbar-minimalize').click(function () {
      $("body").toggleClass("mini-navbar");
      generalChat.toggle();
    });


    generalChat.find('.ibox-content').slimScroll({
      start: 'bottom',
      height: '300px',
      alwaysVisible: true,
      disableFadeOut: true,
      touchScrollStep: 50
    });

    generalChat.on('mouseenter', function () {
      var self = $(this);
      self.css('width', '400px');

      var div = self.find('.ibox-content');
      div.slimScroll({ scrollTo: div[0].scrollHeight});
    }).on('mouseleave', function () {
      var self = $(this);
      self.css('width', '220px');

      var div = self.find('.ibox-content');
      div.slimScroll({ scrollTo: div[0].scrollHeight});
    });
  },

  chatMessageAdded: function () {

    Ember.run.next(this, function () {
      var div = $("#general-chat").find('.ibox-content');
      div.slimScroll({ scrollTo: div[0].scrollHeight});
    });

  }.observes('controller.chatMessages.[]')
});