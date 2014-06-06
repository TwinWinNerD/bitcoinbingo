App.RegisterController = Ember.Controller.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
    actions: {
        register: function () {
            var username, email, password, self, registerButton;

            registerButton = Ladda.create(document.querySelector('#registerButton'));

            registerButton.start();

            username = this.get('username');
            email = this.get('email');
            password = this.get('password');
            self = this;

            return new Ember.RSVP.Promise(function (resolve, reject) {
                socket.post('/auth/local/register', {
                    username: username,
                    email: email,
                    password: password,
                    provider: "local"
                }, function(response) {
                    Ember.run(function() {
                        registerButton.stop();

                        if(response.error) {
                            reject(response.error);
                        } else if(response.user) {
                            var user = response.user;

                            self.get('session').authenticate('authenticator:custom', {
                                identification: username,
                                password: password
                            });

                            resolve(user);
                        }
                    });
                });
            });
        }
    }
});
