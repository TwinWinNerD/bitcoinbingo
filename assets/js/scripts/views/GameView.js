App.GameView = Ember.View.extend({
    didInsertElement: function () {
        $('#room-content').scrollTop($('#room-content')[0].scrollHeight);
        //Activate the tooltip
        $('#buy-cards').tooltip();
        $('#help-button').tooltip();
        //Activate the buy-cards modal
        $('#buy-cards').click(function () {
            $('#buy-cards-modal').modal();
        });
        //Bind the help button
        $('#help-button').click(function () {
            toggleHelpMode();
        });
        //Preloading bingo balls
        for (var i = 2; i <= 5; i++) {
            $('<img/>')[0].src = 'img/bingo-balls/' + i + '.png';
        }
    }
});