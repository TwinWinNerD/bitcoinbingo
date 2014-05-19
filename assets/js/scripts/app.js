var BingoAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({

    restore: function (data) {
        return new Ember.RSVP.Promise(function (resolve, reject) {
            if (!Ember.isEmpty(data)) {
                resolve(data);
            } else {
                reject();
            }
        });
    },

    authenticate: function(credentials) {

        return new Ember.RSVP.Promise(function (resolve, reject) {
            socket.post('/auth/local', {
                identifier: credentials.identification,
                password: credentials.password,
                provider: "local"
        }, function(response) {
                Ember.run(function() {
                    if(response.error) {
                        reject(response.error);
                    } else if(response.user) {
                        resolve(response.user);
                    }
                });
            });
        });
    },

    invalidate: function() {
        return new Ember.RSVP.Promise(function(resolve) {
            socket.get('/logout', function () {
                resolve();
            });
        });
    },
});

Ember.Application.initializer({
    name: 'authentication',
    initialize: function(container, application) {
        container.register('authenticator:custom', BingoAuthenticator);
        Ember.SimpleAuth.setup(container, application, {
            authorizerFactory: 'authorizer:custom',
            routeAfterAuthentication: 'games'
        });
    }
});

window.App = Ember.Application.create({
    LOG_TRANSITIONS: true,
    LOG_TRANSITIONS_INTERNAL: true
});

App.Router.map(function () {
    this.route('login');
    this.route('register');
    this.route('wallet');
    this.resource('games', { path: '/' });
    this.resource('game', { path: '/game/:game_id' });
});