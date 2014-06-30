if (!Modernizr.websockets || !Modernizr.localstorage) {
    $("body .container").empty().html('<p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to use this website.</p>');
}

socket = io.connect();

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
            socket.post('/login', {
                username: credentials.username,
                password: credentials.password
        }, function(response) {
                Ember.run(function() {
                    if(response.error) {
                        reject(response.error);
                    } else if(response) {
                        resolve(response);
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

        Ember.SimpleAuth.Session.reopen({
            currentUser: function() {
                var userId = this.get('id');
                if (!Ember.isEmpty(userId)) {
                    return container.lookup('store:main').find('user', userId);
                }
            }.property('id')
        });


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
    this.resource('settings', { path: '/settings' });
    this.resource('gamesHistory', { path: '/history' });
    this.resource('game', { path: '/game/:game_id' });
});