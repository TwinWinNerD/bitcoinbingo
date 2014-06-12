App.RegisterController = Ember.Controller.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
    actions: {
        register: function () {
            var username, self, registerButton;

            registerButton = Ladda.create(document.querySelector('#registerButton'));

            registerButton.start();

            username = this.get('username');
            self = this;

            return new Ember.RSVP.Promise(function (resolve, reject) {
                socket.post('/api/user', {
                    username: username
                }, function(response) {
                    Ember.run(function() {
                        registerButton.stop();

                        console.log(response);

                        if(response.error) {
                            reject(response.error);
                        } else if(response) {
                            var user = response;

                            self.get('session').authenticate('authenticator:custom', {
                                username: username,
                                password: null
                            });

                            resolve(user);
                        }
                    });
                });
            });
        }
    }
});
