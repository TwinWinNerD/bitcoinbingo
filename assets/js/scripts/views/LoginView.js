App.LoginView = Ember.View.extend({
    didInsertElement: function () {
        Ladda.bind('.ladda-button', {
            timeout: 2000
        });
    }
});