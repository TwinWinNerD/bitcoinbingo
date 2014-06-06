App.LoginController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
    authenticatorFactory: 'authenticator:custom',

    actions: {
        authenticate: function () {
            var loginButton = Ladda.create(document.querySelector('#loginButton'));

            loginButton.start();

            this.get('session').authenticate('authenticator:custom', {
                identification: this.get('identification'),
                password: this.get('password')
            }).then(function () {
                loginButton.stop();
            });
        }
    }
});