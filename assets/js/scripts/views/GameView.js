App.GameView = Ember.View.extend({
    didInsertElement: function () {
        Ember.run.scheduleOnce('afterRender', this, function(){
            $('.chat-widget').slimScroll({
                start: 'bottom',
                height: '300px',
                alwaysVisible: true,
                disableFadeOut: true,
                touchScrollStep: 50
            });
        });
    },

    messagesChanged: function () {

        Ember.run.next(this, function () {
            $(".chat-widget").slimScroll({ scrollTo: $('.chat-widget')[0].scrollHeight});
        });

    }.observes('controller.gameMessages.length')
});