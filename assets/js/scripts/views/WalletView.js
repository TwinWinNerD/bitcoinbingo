App.WalletView = Ember.View.extend({
    didInsertElement: function () {
        var div = $("#depositAddress");

        div.popover({
            html: true,
            placement: 'right',
            content: function () {
                var url = 'https://chart.googleapis.com/chart?chs=225x225&cht=qr&chl=' + div.text() + '&choe=UTF-8';
                return '<img width="250" height="250" src=' + url + ' />';
            },
            trigger: 'hover'
        });
    }
});