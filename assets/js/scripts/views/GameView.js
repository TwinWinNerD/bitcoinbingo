App.GameView = Ember.View.extend({
    didInsertElement: function () {
        Ember.run.scheduleOnce('afterRender', this, function(){
            $(".alert").alert();
            $('.chat-widget').slimScroll({
                start: 'bottom',
                height: '300px',
                alwaysVisible: true,
                disableFadeOut: true,
                touchScrollStep: 50
            });

            $('[data-toggle="tooltip"]').tooltip({});

            var helpMode = 0;
            $("#game-help-button").on('click', function () {
                var popovers = $('.help[data-toggle="popover"]');
                if(helpMode == 0) {
                    popovers.popover('show');
                    return helpMode = 1;
                }
                if(helpMode == 1) {
                    popovers.popover('hide');
                    return helpMode = 0;
                }
            });
        });
    },

    messagesChanged: function () {

        Ember.run.next(this, function () {
            $(".chat-widget").slimScroll({ scrollTo: $('.chat-widget')[0].scrollHeight});
        });

    }.observes('controller.gameMessages.length')
});