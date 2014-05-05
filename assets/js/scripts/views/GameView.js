App.GameView = Ember.View.extend({
    didInsertElement: function () {
        $('.chat-widget').slimScroll({
            start: 'bottom',
            height: '300px',
            alwaysVisible: true,
            disableFadeOut: true,
            touchScrollStep: 50
        });

        //Preloading bingo balls
        for (var i = 2; i <= 5; i++) {
            $('<img/>')[0].src = 'img/bingo-balls/' + i + '.png';
        }

        Ladda.bind('.ladda-button', {
            timeout: 2000
        });
    }
});