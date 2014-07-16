App.LoginController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
    authenticatorFactory: 'authenticator:custom',

    actions: {
        authenticate: function () {
            var loginButton, self;

            self = this;

            loginButton = Ladda.create(document.querySelector('#loginButton'));
            loginButton.start();

            self.set('errorMessage', null);
            this.get('session').authenticate('authenticator:custom', {
                username: this.get('username'),
                password: this.get('password')
            }).then(function () {
                loginButton.stop();
            }, function (error) {
                self.set('errorMessage', error);
                loginButton.stop();
            });
        }
    }
});