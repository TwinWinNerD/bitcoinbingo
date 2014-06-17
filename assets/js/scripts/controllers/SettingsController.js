App.SettingsController = Ember.ObjectController.extend({
    needs: ['currentUser'],
    id: Ember.computed.alias('controllers.currentUser.id'),
    email: Ember.computed.alias('controllers.currentUser.email'),
    clientSeed: Ember.computed.alias('controllers.currentUser.clientSeed'),
    password: '',
    actions: {
        saveSettings: function() {
            var clientSeed, password, email, id, self, saveSettingsButton;

            id = this.get('id');
            email = this.get('email');
            password = this.get('password');
            clientSeed = this.get('clientSeed');

            self = this;

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

                if(result) {
                    self.store.update('user', data);
                    self.set('email', email);
                    self.set('clientSeed', clientSeed);
                }
            });
        }
    }

});