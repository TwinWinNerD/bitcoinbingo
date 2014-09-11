App.RegisterController = Ember.Controller.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
  actions: {
    register: function () {
      var username, self, registerButton;

      registerButton = Ladda.create(document.querySelector('#registerButton'));

      registerButton.start();

      username = this.get('username');
      self = this;

      self.set('errorMessage', null);
      socket.post('/api/user', {
        username: username
      }, function (response) {
        registerButton.stop();

        if (response.error) {
          self.set('errorMessage', response.error);
        } else if (response) {
          self.get('session').authenticate('authenticator:custom', {
            username: username,
            password: null
          }).then(function (user) {
            self.store.find('user', self.get('session.id'));
          });
        }
      });
    }
  }
});
