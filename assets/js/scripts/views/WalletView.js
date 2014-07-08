App.WalletView = Ember.View.extend({
    didInsertElement: function () {
        $("#depositAddress").on('click', function () {
            this.select();
        });
    }
});