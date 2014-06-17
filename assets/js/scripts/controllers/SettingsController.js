App.SettingsController = Ember.ObjectController.extend({
    needs: ['currentUser'],
    id: Ember.computed.alias('controllers.currentUser.id'),
    email: Ember.computed.alias('controllers.currentUser.email'),
    clientSeed: Ember.computed.alias('controllers.currentUser.clientSeed'),
    password: '',
    errorMessage: null,
    successMessage: null,
    actions: {
        saveSettings: function() {
            var clientSeed, password, email, id, self, saveSettingsButton;

            id = this.get('id');
            email = this.get('email');
            password = this.get('password');
            clientSeed = this.get('clientSeed');
            self = this;

            self.set('errorMessage', null);
            self.set('successMessage', null);

            saveSettingsButton = Ladda.create(document.querySelector('#saveSettings'));
            saveSettingsButton.start();

            var data = {
                id: id,
                email: email,
                clientSeed: clientSeed
            };

            if(password !== '') {
                data.password = password;
            }

            socket.put('/api/user/' + id, data, function (result) {
                saveSettingsButton.stop();

                if(typeof result.error !== "undefined") {
                    self.set('errorMessage', result.summary);
                } else {
                    self.store.update('user', data);
                    self.set('email', email);
                    self.set('clientSeed', clientSeed);
                    self.set('successMessage', true);
                }

            });
        }
    }

});